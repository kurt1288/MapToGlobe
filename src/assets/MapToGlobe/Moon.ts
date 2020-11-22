import * as THREE from 'three';

export default class Moon {
    private planet: THREE.Mesh;
    moon: THREE.Mesh;
    object: THREE.Object3D;

    constructor(planet: THREE.Mesh, json?: THREE.Mesh) {
        this.planet = planet;

        if (json) {
            this.moon = json;
        }
        else {
            const geometry = new THREE.SphereBufferGeometry(0.5, 100, 100);
            const material = new THREE.MeshPhongMaterial();
            const object = new THREE.Mesh(geometry, material);
            object.position.set(3, 0, 0);
            object.name = "moon";
            object.castShadow = true;
            object.receiveShadow = true;
            this.moon = object;
        }

        // Create a pivot point to rotate around (from https://stackoverflow.com/questions/37903979/set-an-objects-absolute-rotation-around-the-world-axis)
        const pivot = new THREE.Object3D();
        pivot.name = "moonParent";
        pivot.add(this.moon);

        this.object = pivot;
    }

    Show() {
        if (!this.planet.getObjectById(this.object.id))
            this.planet.add(this.object);
    }

    Remove() {
        this.planet.remove(this.object);
    }

    SetSurfaceImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = this.moon.material as THREE.MeshPhongMaterial;
            material.map = res;
            material.needsUpdate = true;
        });
    }

    Scale(num: number) {
        this.moon.scale.set(num, num, num);
    }

    Distance(num: number) {
        this.moon.position.set(num, 0, 0);
    }
}