import * as THREE from "three";

// --------------------------------------------------------------

/**
 * Box geometri oluşturmak için bir fonksiyon
 */
export function createBoxGeometry(meshName, width, height, depth, color) {
  let boxGeometry = new THREE.BoxGeometry(width, height, depth);
  // kutunun yüzeyini yeşil renkte göstermek için bir malzeme oluşturuyoruz
  let material = new THREE.MeshBasicMaterial({ color });
  // geometri ve malzemeyi birleştirerek bir mesh oluşturuyoruz
  let mesh = new THREE.Mesh(boxGeometry, material);
  mesh.name = meshName;
  return mesh;
}
