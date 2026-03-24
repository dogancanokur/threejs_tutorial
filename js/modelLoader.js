import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// --------------------------------------------------------------

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

function createExpamleModel() {
  gltfLoader.load("models/airbus/scene.gltf", function (gltf) {
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    const texture = textureLoader.load(
      "models/airbus/textures/material02_baseColor.jpg",
    );
    const material = new THREE.MeshBasicMaterial({ map: texture });
    gltf.scene.material = material;
    scene.add(gltf.scene);
  });
}

export function createGLTFModel(gltfPath, texturePath, meshName) {
  const textureLoader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(gltfPath, function (gltf) {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, 0.5, 0);
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    gltf.scene.material = material;
    gltf.scene.name = meshName;
    scene.add(gltf.scene);
  });
}
