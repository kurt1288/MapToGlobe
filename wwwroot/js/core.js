'use strict';

import { vertexSky, fragmentSky, vertexGround, fragmentGround } from "./atmosphere.min.js";
import { CanvasVideo } from "./CanvasVideo.js";

class MapToGlobe {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("black");

        // Camera
        this.camera = new THREE.PerspectiveCamera(25, document.getElementById("mainCanvas").offsetWidth / document.getElementById("mainCanvas").offsetHeight, 0.1, 2000);
        this.camera.position.z = 12;
        this.scene.add(this.camera);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("mainCanvas"), alpha: true, preserveDrawingBuffer: true, antialias: true });
        this.renderer.setSize(window.innerWidth - document.getElementById("sideBar").offsetWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        // Controls
        const orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.enablePan = false;
        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener("dragging-changed", function (event) {
            orbitControls.enabled = !event.value;
        });
        this.transformControls.setMode("rotate");
        this.transformControls.setSize(1.5);

        this.gif = false;

        this.Animate();
    }

    CreateGif(object, direction) {
        const video = new CanvasVideo(document.getElementById("mainCanvas"), 40, 4000000);
        let tween;
        tween = new TWEEN.Tween(object.rotation).to({ y: direction }, 1000);

        tween.onStart(() => {
            video.Start();
        }).onComplete(() => {
            this.gif = false;
            video.Stop();

            video.Save("maptoglobe.webm");
        }).start();
        this.gif = true;
    }

    AttachControls(object, type) {
        this.transformControls.attach(object);
        this.transformControls.setMode(type);
        this.scene.add(this.transformControls);
    }

    DetachControls() {
        this.transformControls.detach();
    }

    Animate() {
        requestAnimationFrame(this.Animate.bind(this));

        if (this.gif === true)
            TWEEN.update();

        this.renderer.render(this.scene, this.camera);
    }

    TakeScreenshot() {
        const canvasData = document.getElementById("mainCanvas").toDataURL("image/jpeg", 7.0);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.id = "tempScreenshotElement";
        a.style.display = "none";
        a.href = canvasData;
        a.download = "maptoglobe.jpg";
        a.click();
        setTimeout(() => {
            document.getElementById("tempScreenshotElement").remove();
        }, 100);
    }

    Save(callback) {
        fetch("/home/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Data: JSON.stringify(this.scene.toJSON()) })
        })
        .then(res => res.json())
        .then(function(response) {
            const json = JSON.parse(response);
            history.pushState(null, null, json.id + "?key=" + json.key);
            callback({ IsSuccess: true, data: json });
        })
        .catch(function (error) {
            callback({ IsSuccess: false, data: error });
        });
    }

    Update(callback) {
        fetch("/home/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id: window.location.pathname.split("/")[1], Key: new URLSearchParams(window.location.search).get("key"), Data: JSON.stringify(this.scene.toJSON()) })
        })
        .then(res => res.status)
            .then(function (response) {
            if (response === 200)
                callback({ IsSuccess: true });
            else
                callback({ IsSuccess: false, data: response });
        })
        .catch(function (error) {
            callback({ IsSuccess: false, data: error });
        });
    }

    Load(key, callback) {
        const loader = new THREE.ObjectLoader();
        loader.parse(JSON.parse(key), function (object) {
            instance.scene = object;

            // Need to set the camera to the new camera and the controls to the new camera
            instance.camera = object.children.find(x => x.type === "PerspectiveCamera");
            const orbitControls = new THREE.OrbitControls(instance.camera, instance.renderer.domElement);
            const transformControls = new THREE.TransformControls(instance.camera, instance.renderer.domElement);
            transformControls.addEventListener("dragging-changed", function (event) {
                orbitControls.enabled = !event.value;
            });
            transformControls.setMode("rotate");
            transformControls.setSize(1.5);

            instance.transformControls = transformControls;

            // return object's children (every object in the scene) so that the UI can be configured to match the loaded scene
            callback(object.children);
        });
    }

    SetBGBlack() {
        this.scene.background = new THREE.Color(0x000000);
    }

    LoadBGImage(image, callback) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(image);
        loader.load(fileURL, function (res) {
            callback(res);
        });
    }

    SetBGImage(image) {
        instance.scene.background = image;
    }

    SetBGTransparent() {
        this.scene.background = null;
    }

    WindowResize() {
        this.camera.aspect = (window.innerWidth - document.getElementById("sideBar").offsetWidth) / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth - document.getElementById("sideBar").offsetWidth, window.innerHeight);
    }
}

class Light {
    constructor() {
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(0, 0, 100);
        this.light.name = "directionalLight";
        this.ambientLight = new THREE.AmbientLight(0x404040, 0);
        this.ambientLight.name = "ambientLight";

        // Shadow properties
        this.light.castShadow = true;

        this.anchor = new THREE.Object3D();
        this.anchor.position.set(0, 0, 0);
        this.anchor.name = "lightParent";
        this.anchor.add(this.light);

        instance.scene.add(this.ambientLight);
        instance.scene.add(this.anchor);
    }

    static SetIntensity(value, object) {
        object.intensity = value;
    }

    SetAmbientIntensity(value) {
        this.ambientLight.intensity = value;
    }
}

class Planet {
    constructor() {
        const materialArray = [
            new THREE.MeshPhongMaterial(), // main material
            new THREE.ShaderMaterial({ visible: false }) // material for atmopshere
        ];

        const sphereGeometry = new THREE.SphereBufferGeometry(2, 100, 100);

        // See https://stackoverflow.com/a/56674615/1078475 as to why this second geometry is needed
        const geometry = new THREE.BufferGeometry();
        geometry.attributes = sphereGeometry.attributes;
        geometry.index = sphereGeometry.index;
        geometry.addGroup(0, geometry.index.count, 0);
        geometry.addGroup(0, geometry.index.count, 1);

        this.Object = new THREE.Mesh(geometry, materialArray);
        this.Object.name = "planet";
        this.Object.castShadow = true;
        this.Object.receiveShadow = true;

        instance.scene.add(this.Object);

        return this.Object;
    }

    static SetSurface(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            object.material[0].map = res;
            object.material[0].needsUpdate = true;
        });
    }

    static SetHeightMap(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, function (res) {
            object.material[0].bumpMap = res;
            object.material[0].bumpScale = 0.05;
            object.material[0].needsUpdate = true;
        });
    }

    static SetNightMap(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, function (res) {
            object.material[0].nightMap = res;
            object.material[0].needsUpdate = true;
        });
    }

    static SetSpecular(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, function (res) {
            object.material[0].specularMap = res;
            object.material[0].needsUpdate = true;
        });
    }

    static ToggleAxis(object) {
        if (!object.getObjectByName("lineAxis")) {
            const LineAxisMaterial = new THREE.LineBasicMaterial({ color: 0xFFEA00 });
            const LineAxisGeometry = new THREE.BufferGeometry();
            LineAxisGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0, 0, -3, 0, 0, 3, 0]), 3));
            const LineAxis = new THREE.Line(LineAxisGeometry, LineAxisMaterial);
            LineAxis.name = "lineAxis";
            object.add(LineAxis);
        } else {
            object.remove(object.getObjectByName("lineAxis"));
        }
    }
}

class Moon {
    constructor() {
        const geometry = new THREE.SphereBufferGeometry(0.5, 100, 100);
        const material = new THREE.MeshPhongMaterial();
        this.moon = new THREE.Mesh(geometry, material);
        this.moon.position.set(3, 0, 0);
        this.moon.name = "moon";
        this.moon.castShadow = true;
        this.moon.receiveShadow = true;

        // Create a pivot point to rotate around (from https://stackoverflow.com/questions/37903979/set-an-objects-absolute-rotation-around-the-world-axis)
        this.Object = new THREE.Object3D();
        this.Object.name = "moonParent";
        this.Object.add(this.moon);

        instance.scene.add(this.Object);
    }

    static Remove(object) {
        object.children[0].material.dispose();
        object.children[0].geometry.dispose();
        instance.scene.remove(object);
    }

    static SetSurface(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            object.material.map = res;
            object.material.needsUpdate = true;
        });
    }

    static SetDistance(value, object) {
        object.position.set(value, 0, 0);
    }
}

class Rings {
    constructor() {
        const geometry = new THREE.RingBufferGeometry(3, 5, 96, 1);
        const material = new THREE.MeshLambertMaterial({ transparent: true });
        this.rings = new THREE.Mesh(geometry, material);
        this.rings.name = "rings";
        this.rings.castShadow = true;
        this.rings.receiveShadow = true;
        Rings.DrawRings(this.rings, geometry);

        instance.scene.add(this.rings);

        return this.rings;
    }

    static DrawRings(mesh, geometry) {
        // From https://stackoverflow.com/a/43024222/1078475
        let uvs = geometry.attributes.uv.array;
        let phiSegments = geometry.parameters.phiSegments || 0;
        let thetaSegments = geometry.parameters.thetaSegments || 0;
        phiSegments = phiSegments !== undefined ? Math.max(1, phiSegments) : 1;
        thetaSegments = thetaSegments !== undefined ? Math.max(3, thetaSegments) : 8;
        for (let c = 0, j = 0; j <= phiSegments; j++) {
            for (let i = 0; i <= thetaSegments; i++) {
                uvs[c++] = i / thetaSegments,
                    uvs[c++] = j / phiSegments;
            }
        }
    }

    static SetTexture(file, object) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, function (res) {
            object.material.map = res;
            object.material.needsUpdate = true;
        });
    }

    static Remove(object) {
        object.material.dispose();
        object.geometry.dispose();
        instance.scene.remove(object);
    }

    static SetRadius(value, object) {
        object.geometry.dispose();
        object.geometry = new THREE.RingBufferGeometry(value[0], value[1], 50, object.geometry.parameters.thetaSegments, object.geometry.parameters.phiSegments);
        Rings.DrawRings(object.rings, object.geometry);
    }
}

class Atmosphere {
    constructor(planet, light) {
        const settings = Atmosphere.Settings(planet);
        
        settings.diffuseNight = planet.material[0].nightMap || settings.diffuse;

        const maxAnisotropy = instance.renderer.capabilities.getMaxAnisotropy();
        settings.diffuse.anisotropy = maxAnisotropy;
        settings.diffuseNight.anisotropy = maxAnisotropy;

        const uniforms = Atmosphere.getAtmosphereUniforms(instance, light, settings);

        planet.material[1].uniforms = uniforms;
        planet.material[1].vertexShader = vertexGround;
        planet.material[1].fragmentShader = fragmentGround;

        const geometry = new THREE.SphereBufferGeometry(settings.outerRadius, 100, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexSky,
            fragmentShader: fragmentSky
        });
        material.side = THREE.BackSide;
        material.transparent = true;
        this.sky = new THREE.Mesh(geometry, material);
        this.sky.name = "atmosphere";

        this.scrollEvent = this.Zoom.bind(null, this, light, planet);

        instance.scene.add(this.sky);
        planet.material[1].visible = true;
        planet.material[0].visible = false;
        instance.renderer.domElement.addEventListener("wheel", this.scrollEvent, false);

        return this.sky;
    }

    static Settings(planet) {
        return {
            Kr: 0.0025,
            Km: 0.0010,
            ESun: 20,
            g: -0.950,
            innerRadius: 2,
            outerRadius: 2.1,
            wavelength: [0.650, 0.570, 0.475],
            scaleDepth: 0.25,
            mieScaleDepth: 0.1,
            diffuse: planet.material[0].map,
            defaultDarkness: 1
        };
    }

    static Remove(atmosphere, planet) {
        planet.material[1].visible = false;
        planet.material[0].visible = true;
        planet.material[1].dispose();
        instance.scene.remove(atmosphere);
        instance.renderer.domElement.removeEventListener("wheel", this.scrollEvent, false);
    }

    static Update(atmosphere, planet, item, value) {
        switch (item) {
            case "darkness":
                atmosphere.material.uniforms.fNightScale.value = value;
                planet.material[1].uniforms.fNightScale.value = value;
                break;
            case "rayleigh":
                atmosphere.material.uniforms.fKrESun.value = value * Atmosphere.Settings(planet).ESun;
                atmosphere.material.uniforms.fKr4PI.value = value * 4 * Math.PI;
                planet.material[1].uniforms.fKrESun.value = value * Atmosphere.Settings(planet).ESun;
                planet.material[1].uniforms.fKr4PI.value = value * 4 * Math.PI;
                break;
            case "mie":
                atmosphere.material.uniforms.fKmESun.value = value * Atmosphere.Settings(planet).ESun;
                atmosphere.material.uniforms.fKm4PI.value = value * 4.0 * Math.PI;
                planet.material[1].uniforms.fKmESun.value = value * Atmosphere.Settings(planet).ESun;
                planet.material[1].uniforms.fKm4PI.value = value * 4.0 * Math.PI;
                break;
            case "color":
                const r = parseFloat(value.r / 255).toFixed(3);
                const g = parseFloat(value.g / 255).toFixed(3);
                const b = parseFloat(value.b / 255).toFixed(3);
                atmosphere.material.uniforms.v3InvWavelength.value = new THREE.Vector3(1 / Math.pow(r, 4), 1 / Math.pow(g, 4), 1 / Math.pow(b, 4));
                break;
        }
    }

    Zoom(atmosphere, light, planet) {
        atmosphere.sky.material.uniforms.v3LightPosition.value = light.position.clone().normalize();
        atmosphere.sky.material.uniforms.fCameraHeight.value = light.position.length();
        atmosphere.sky.material.uniforms.fCameraHeight2.value = instance.camera.position.length() * instance.camera.position.length();
        planet.material[1].uniforms.v3LightPosition.value = light.position.clone().normalize();
        planet.material[1].uniforms.fCameraHeight.value = light.position.length();
        planet.material[1].uniforms.fCameraHeight2.value = instance.camera.position.length() * instance.camera.position.length();
    }

    static getAtmosphereUniforms(scene, light, atmosphere) {
        return {
            v3LightPosition: {
                type: "v3",
                value: light.position.clone().normalize()
            },
            v3InvWavelength: {
                type: "v3",
                value: new THREE.Vector3(1 / Math.pow(atmosphere.wavelength[0], 4), 1 / Math.pow(atmosphere.wavelength[1], 4), 1 / Math.pow(atmosphere.wavelength[2], 4))
            },
            fCameraHeight: {
                type: "f",
                value: light.position.length()
            },
            fCameraHeight2: {
                type: "f",
                value: scene.camera.position.length() * scene.camera.position.length()
            },
            fInnerRadius: {
                type: "f",
                value: atmosphere.innerRadius
            },
            fInnerRadius2: {
                type: "f",
                value: atmosphere.innerRadius * atmosphere.innerRadius
            },
            fOuterRadius: {
                type: "f",
                value: atmosphere.outerRadius
            },
            fOuterRadius2: {
                type: "f",
                value: atmosphere.outerRadius * atmosphere.outerRadius
            },
            fKrESun: {
                type: "f",
                value: atmosphere.Kr * atmosphere.ESun
            },
            fKmESun: {
                type: "f",
                value: atmosphere.Km * atmosphere.ESun
            },
            fKr4PI: {
                type: "f",
                value: atmosphere.Kr * 4.0 * Math.PI
            },
            fKm4PI: {
                type: "f",
                value: atmosphere.Km * 4.0 * Math.PI
            },
            fScale: {
                type: "f",
                value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius)
            },
            fScaleDepth: {
                type: "f",
                value: atmosphere.scaleDepth
            },
            fScaleOverScaleDepth: {
                type: "f",
                value: 1 / (atmosphere.outerRadius - atmosphere.innerRadius) / atmosphere.scaleDepth
            },
            g: {
                type: "f",
                value: atmosphere.g
            },
            g2: {
                type: "f",
                value: atmosphere.g * atmosphere.g
            },
            nSamples: {
                type: "i",
                value: 3
            },
            fSamples: {
                type: "f",
                value: 3.0
            },
            tDiffuse: {
                type: "t",
                value: atmosphere.diffuse
            },
            tDiffuseNight: {
                type: "t",
                value: atmosphere.diffuseNight
            },
            tDisplacement: {
                type: "t",
                value: 0
            },
            tSkyboxDiffuse: {
                type: "t",
                value: 0
            },
            fNightScale: {
                type: "f",
                value: atmosphere.defaultDarkness
            }
        };
    }
}

const instance = new MapToGlobe();
export { instance as MapToGlobe, Planet as Planet, Moon as Moon, Rings as Rings, Atmosphere as Atmosphere, Light as Light };