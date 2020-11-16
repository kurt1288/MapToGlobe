import * as THREE from 'three';

export default class Planet {
    object: THREE.Mesh;

    constructor(json?: THREE.Mesh) {
        if (json) {
            this.object = json;
            return;
        }

        const materialArray = [
            new THREE.MeshPhongMaterial(), // main material
            new THREE.ShaderMaterial({ visible: false }) // material for atmopshere
        ];

        const sphereGeometry = new THREE.SphereBufferGeometry(2, 100, 100);

        // See https://stackoverflow.com/a/56674615/1078475 as to why this second geometry is needed
        const geometry = new THREE.BufferGeometry();
        geometry.attributes = sphereGeometry.attributes;
        geometry.index = sphereGeometry.index as THREE.BufferAttribute;
        geometry.addGroup(0, geometry.index.count, 0);
        geometry.addGroup(0, geometry.index.count, 1);

        const object = new THREE.Mesh(geometry, materialArray);
        object.name = "planet";
        object.castShadow = true;
        object.receiveShadow = true;

        this.object = object;
    }

    SetSurfaceImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = (this.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial;
            material.map = res;
            material.needsUpdate = true;
        });
    }

    SetHeightmapImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = (this.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial;
            material.bumpMap = res;
            material.bumpScale = 0.05;
            material.needsUpdate = true;
        });
    }

    SetSpecularImage(file: File) {
        const loader = new THREE.TextureLoader();
        const fileURL = URL.createObjectURL(file);
        loader.load(fileURL, (res) => {
            const material = (this.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial;
            material.specularMap = res;
            material.needsUpdate = true;
        });
    }

    ToggleAxis() {
        if (!this.object.getObjectByName("lineAxis")) {
            const LineAxisMaterial = new THREE.LineBasicMaterial({ color: 0xFFEA00 });
            const LineAxisGeometry = new THREE.BufferGeometry();
            LineAxisGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0, 0, -3, 0, 0, 3, 0]), 3));
            const LineAxis = new THREE.Line(LineAxisGeometry, LineAxisMaterial);
            LineAxis.name = "lineAxis";
            this.object.add(LineAxis);
        } else {
            const axis = this.object.getObjectByName("lineAxis") as THREE.Object3D;
            this.object.remove(axis);
        }
    }

    SetCloudsImage(file: File) {
        const sphereGeometry = new THREE.SphereBufferGeometry(2.02, 100, 100);
        const image = new THREE.TextureLoader().load(URL.createObjectURL(file));

        const material = new THREE.MeshPhongMaterial({
            map: image,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.8 // This needs to match the light intensity value in the scene
        });

        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.name = "clouds";

        mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: image,
            alphaTest: 0.4
        });

        mesh.castShadow = true;

        this.object.add(mesh);
    }
}