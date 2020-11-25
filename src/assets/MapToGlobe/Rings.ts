import * as THREE from 'three';

export default class Rings {
    private planet: THREE.Mesh;
    object: THREE.Mesh;

    constructor(planet: THREE.Mesh, json?: THREE.Mesh) {
        this.planet = planet;
        
        if (json) {
            this.object = json;
            return;
        }

        const geometry = new THREE.RingBufferGeometry(3, 5, 96, 1);
        const material = new THREE.MeshLambertMaterial({ transparent: true, side: THREE.DoubleSide });
        const rings = new THREE.Mesh(geometry, material);
        rings.name = "rings";
        rings.receiveShadow = true;

        // https://discourse.threejs.org/t/applying-a-texture-to-a-ringgeometry/9990
        const pos = geometry.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++){
            v3.fromBufferAttribute(pos, i);
            geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
        }

        this.object = rings;
    }

    Toggle() {
        if (!this.planet.getObjectById(this.object.id))
            this.planet.add(this.object);
        else
        this.planet.remove(this.object);
    }

    SetSurfaceImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = this.object.material as THREE.MeshPhongMaterial;
            material.map = res;
            material.needsUpdate = true;
        });
    }

    SetTransparencyImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = this.object.material as THREE.MeshPhongMaterial;
            material.alphaMap = res;
            material.needsUpdate = true;
        });
    }
}