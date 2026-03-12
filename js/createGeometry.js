import * as THREE from "three";

// --------------------------------------------------------------

/**
 * Box geometri oluşturmak için bir fonksiyon
 */
export default function createBoxGeometry(
  meshName,
  width,
  height,
  depth,
  color,
  x = 0,
  y = 0,
  z = 0,
  castShadow = false,
  receiveShadow = false,
  gui,
) {
  let boxGeometry = new THREE.BoxGeometry(width, height, depth);
  // kutunun yüzeyini yeşil renkte göstermek için bir malzeme oluşturuyoruz
  // !!! MeshBasicMaterial, ışıklandırmadan etkilenmeyen basit bir malzemedir
  // !!! o yüzden MeshStandardMaterial kullanarak ışıklandırmadan etkilenmesini sağlayalım
  let material = new THREE.MeshStandardMaterial({ color });
  // geometri ve malzemeyi birleştirerek bir mesh oluşturuyoruz
  let mesh = new THREE.Mesh(boxGeometry, material);
  mesh.position.set(x, y, z);
  mesh.name = meshName;
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;

  window.scene.add(mesh);
  if (gui) {
    guiConfig(meshName, gui);
  }
  return mesh;
}

function guiConfig(meshName, gui) {
  //
  if (!window.scene.getObjectByName(meshName)) {
    THREE.warn(`Mesh with name "${meshName}" not found in the scene.`);
    return;
  }
  let mesh = scene.getObjectByName(meshName);
  const propertiesFolder = gui.addFolder(meshName + " Properties");

  // renk değiştirme için bir color picker ekleyelim
  propertiesFolder
    .addColor({ color: "#" + mesh.material.color.getHexString() }, "color")
    .onChange((value) => {
      mesh.material.color.set(value);
    });

  const positionFolder = propertiesFolder.addFolder(meshName + " Position");
  positionFolder.add(mesh.position, "x", -5, 5);
  positionFolder.add(mesh.position, "y", -5, 5);
  positionFolder.add(mesh.position, "z", -5, 5);

  const rotationFolder = propertiesFolder.addFolder(meshName + " Rotation");
  rotationFolder.add(mesh.rotation, "x", -5, 5);
  rotationFolder.add(mesh.rotation, "y", -5, 5);
  rotationFolder.add(mesh.rotation, "z", -5, 5);
}
