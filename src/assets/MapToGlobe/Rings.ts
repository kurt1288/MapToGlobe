import * as THREE from 'three';

export default class Rings {
    private scene: THREE.Scene;
    object: THREE.Mesh;

    constructor(scene: THREE.Scene, json?: THREE.Mesh) {
        this.scene = scene;
        
        if (json) {
            this.object = json;
            return;
        }

        const geometry = new THREE.RingBufferGeometry(3, 5, 96, 1);
        const material = new THREE.MeshLambertMaterial({ transparent: true });
        const rings = new THREE.Mesh(geometry, material);
        rings.name = "rings";
        rings.castShadow = true;
        rings.receiveShadow = true;
        
        // From https://stackoverflow.com/a/43024222/1078475
        const uvs = geometry.attributes.uv.array as Array<number>;
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

        this.object = rings;
    }

    Toggle() {
        if (!this.scene.getObjectById(this.object.id))
            this.scene.add(this.object);
        else
        this.scene.remove(this.object);
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
}