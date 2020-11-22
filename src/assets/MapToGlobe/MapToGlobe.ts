import * as THREE from 'three';
import { Tween, update } from '@tweenjs/tween.js';
import CanvasVideo from './CanvasVideo';
import * as Firebase from '../../firebase';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import pako from 'pako';

import Scene from './Scene';
import Planet from './Planet';
import Moon from './Moon';
import Rings from './Rings';

interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
}

interface SaveResponse {
    success: boolean;
    message?: string;
    id?: string;
    key?: string;
}

export default class MapToGlobe {
    private animationId: number;
    instance: Scene;
    planet: Planet;
    moon: Moon;
    rings: Rings;
    sunFar = false;

    constructor(element: HTMLCanvasElement) {
        this.instance = new Scene(element);
        this.planet = new Planet();
        this.instance.pivotObject.add(this.planet.object);

        this.moon = new Moon(this.planet.object);
        this.rings = new Rings(this.planet.object);

        let oldDistance = this.instance.camera.getWorldPosition(new THREE.Vector3(0,0,0)).distanceTo(this.planet.object.getWorldPosition(new THREE.Vector3(0,0,0)));

        this.instance.orbitControls.addEventListener("change", (event: THREE.Event) => {
            const newDistance = this.instance.camera.getWorldPosition(new THREE.Vector3(0,0,0)).distanceTo(this.planet.object.getWorldPosition(new THREE.Vector3(0,0,0)));
            
            if (oldDistance < 15 && newDistance > 15) {
                this.instance.SetSunFar();
                this.sunFar = true;
            }
            else if (oldDistance > 15 && newDistance < 15) {
                this.instance.SetSunClose();
                this.sunFar = false;
            }

            oldDistance = newDistance;
        });

        this.animationId = 0;

        this.Animate();
    }

    Animate() {
        this.animationId = requestAnimationFrame(this.Animate.bind(this));

        this.instance.orbitControls.update();

        update(); // Update tween

        this.instance.renderer.render(this.instance.scene, this.instance.camera);
    }

    StopAnimation() {
        cancelAnimationFrame(this.animationId);
    }

    AddMoon() {
        this.moon.Show();
    }

    RemoveMoon() {
        this.moon.Remove();
    }

    ToggleRings() {
        this.rings.Toggle();
    }

    SetBGBlack() {
        this.instance.SetBGBlack();
    }

    SetBGImage(file: File) {
        this.instance.SetBGImage(file);
    }

    SetBGTransparent() {
        this.instance.SetBGTransparent();
    }

    ToggleControls(object: THREE.Mesh) {
        if (object === this.instance.controls.object) {
            this.instance.controls.detach();
        } else if (object !== this.instance.controls.object && this.instance.controls.visible) {
            this.instance.controls.detach();
            this.instance.controls.attach(object);
        } else {
            this.instance.controls.attach(object);
        }
    }

    Gif(canvas: CanvasElement) {
        const video = new CanvasVideo(canvas, 4000000);

        const object = this.sunFar ? this.instance.pivotObject.rotation : this.planet.object.rotation;
        const tween = new Tween(object).to({ y: `+${(360 * (Math.PI / 180))}` }, 5000);

        video.Start();
        tween.onComplete(() => {
            video.Stop();
        }).start();
    }
    
    Screenshot(canvas: CanvasElement) {
        const canvasData = canvas.toDataURL("image/jpeg", 7.0);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.id = "tempScreenshotElement";
        a.style.display = "none";
        a.href = canvasData;
        a.download = "maptoglobe.jpg";
        a.click();
        setTimeout(() => {
            (document.getElementById("tempScreenshotElement") as HTMLLinkElement).remove();
        }, 100);
    }

    async Save(route: RouteLocationNormalizedLoaded, loadedJson: any): Promise<SaveResponse> {
        const imageLoader = new THREE.ImageLoader();
        const sceneJson = this.instance.scene.toJSON();

        try {
            const currentImages = sceneJson.images;

            if (currentImages === undefined || currentImages.length <= 0)
                return { success: false, message: "Nothing to save." };

            for (let i = 0; i < currentImages.length; i++) {
                const data = new FormData();

                // Don't want to upload images again to Imgur if they already are. Need to load the URL to get the base64 for comparison.
                const image = await imageLoader.loadAsync(currentImages[i].url);
                if ((loadedJson.images !== undefined && loadedJson.images.length > 0) && image.src === loadedJson.images[i].url)
                    continue;

                data.append("image", currentImages[i].url.replace(/^data:image\/.+;base64,/, ""));
                data.append("type", "base64");
    
                const response = await fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                        "Authorization": "Client-ID e175e7594f479f8"
                    },
                    body: data
                });

                if (response.status !== 200)
                    throw new Error(`There was an error while uploading the images: ${(response as any).data.error}`);
                    
                const result = await response.json();
    
                currentImages[i].url = result.data.link;
            }

            let deflated = pako.deflate(JSON.stringify(sceneJson), { to: "string" });
            deflated = btoa(deflated);

            if (route.params.saveId && route.query.key !== undefined)
                return await Firebase.Update(deflated, { id: route.params.saveId, key: route.query.key });
            else
                return await Firebase.Save(deflated);
        }
        catch (exception) {
            return { success: false, message: `There was an error while trying to save: ${exception}` };
        }
    }

    Load(data: any) {
        data = JSON.parse(pako.inflate(atob(JSON.parse(data)), { to: "string" }));
        const loader = new THREE.ObjectLoader();
        
        return new Promise((resolve, reject) => {
            loader.parse(data, (object: THREE.Object3D) => {
                const rings = object.getObjectByName("rings");
                const moon = object.getObjectByName("moon");
    
                // Remove original planet and add one from saved data
                this.instance.scene.remove(this.instance.scene.getObjectByName("planet") as THREE.Object3D);
                this.planet = new Planet(object.getObjectByName("planet") as THREE.Mesh);
                this.instance.scene.add(this.planet.object);
    
                // Remove original rings and add one from saved data
                if (rings) {
                    this.instance.scene.remove(this.instance.scene.getObjectByName("rings") as THREE.Object3D);
                    this.rings = new Rings(this.planet.object, rings as THREE.Mesh);
                    this.instance.scene.add(this.rings.object);
                }
    
                // Remove original moon and add one from saved data
                if (moon) {
                    this.instance.scene.remove(this.instance.scene.getObjectByName("moon") as THREE.Object3D);
                    this.moon = new Moon(this.planet.object, moon as THREE.Mesh);
                    this.instance.scene.add(this.moon.object);
                }
    
                // Set light properties
                this.instance.SetAmbientIntensity((object.getObjectByName("ambientLight") as THREE.AmbientLight).intensity);
                this.instance.SetSunIntensity((object.getObjectByName("directionalLight") as THREE.DirectionalLight).intensity);

                resolve();
            })
        })
    }
}