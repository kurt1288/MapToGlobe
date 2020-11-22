import { Tween, Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export default class Scene {
    scene: THREE.Scene;
    renderer: THREE.Renderer;
    camera: THREE.PerspectiveCamera;
    controls: TransformControls;
    light: THREE.Object3D;
    ambient: THREE.AmbientLight;
    orbitControls: OrbitControls;
    oldLightPosition: THREE.Quaternion;
    pivotObject = new THREE.Object3D();

    constructor(element: HTMLCanvasElement) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("black");

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas: element, alpha: true, preserveDrawingBuffer: true, antialias: true });
        renderer.setSize((element.parentElement as HTMLDivElement).clientWidth, window.innerHeight); // Need to set height or width minus navbar
        renderer.shadowMap.enabled = true;

        // Camera
        const camera = new THREE.PerspectiveCamera(25, element.offsetWidth / element.offsetHeight, 0.1, 2000);
        camera.position.z = 12;
        scene.add(camera);

        // Sun light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        light.name = "directionalLight";
        light.castShadow = true;
        light.intensity = 0.4;

        // Controls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enablePan = false;
        orbitControls.enableDamping = true;
        const transformControls = new TransformControls(camera, renderer.domElement);
        transformControls.addEventListener("dragging-changed", function (event: THREE.Event) {
            orbitControls.enabled = !event.value;
        });
        transformControls.setMode("rotate");
        transformControls.setSize(1.5);
        scene.add(transformControls);

        // To lighten shadows. See https://github.com/mrdoob/three.js/pull/14087#issuecomment-431003830
        const light2 = light.clone();
        light2.castShadow = false;
        light2.intensity = 1 - 0.4;
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        ambientLight.name = "ambientLight";

        const anchor = new THREE.Object3D();
        anchor.position.set(0, 0, 0);
        anchor.name = "lightParent";
        anchor.add(light);
        anchor.add(light2);

        this.oldLightPosition = anchor.quaternion.clone();

        scene.add(ambientLight);
        camera.add(anchor);

        scene.add(this.pivotObject);

        window.addEventListener("resize", () => {
            this.camera.aspect = (element.parentElement as HTMLDivElement).clientWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize((element.parentElement as HTMLDivElement).clientWidth, window.innerHeight);
        });

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = transformControls;
        this.light = anchor;
        this.ambient = ambientLight;
        this.orbitControls = orbitControls;
    }

    SetBGBlack() {
        this.scene.background = new THREE.Color(0x000000);
    }

    SetBGTransparent() {
        this.scene.background = null;
    }

    SetBGImage(image: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(image);
        loader.load(fileURL, (res) => {
            this.scene.background = res;
        });
    }

    SetSunIntensity(num: number) {
        (this.light.children[0] as THREE.DirectionalLight).intensity = num / 2;
    }

    SetAmbientIntensity(num: number) {
        (this.scene.getObjectByName("ambientLight") as THREE.AmbientLight).intensity = num;
    }

    SetSunFar() {
        this.light.applyQuaternion(this.camera.quaternion.clone());
        this.pivotObject.add(this.light);
        new Tween(this.light.quaternion).to(this.oldLightPosition, 750).easing(Easing.Cubic.Out).start();
    }

    SetSunClose() {
        this.oldLightPosition = this.light.quaternion.clone();
        const endQuaternion = this.camera.quaternion.clone();
        this.light.applyQuaternion(endQuaternion.clone().inverse());
        this.camera.add(this.light);
        new Tween(this.light.quaternion).to(new THREE.Quaternion(), 750).easing(Easing.Cubic.Out).start();
    }
}