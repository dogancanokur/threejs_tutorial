import * as THREE from "three";

// --------------------------------------------------------------

/**
 * Box geometri oluşturmak için bir fonksiyon
 */
export function createBoxGeometry(
  meshName,
  width,
  height,
  depth,
  color,
  x = 0,
  y = 0,
  z = 0,
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
  const gbf = gui.addFolder(meshName + " Properties");
  // renk değiştirme için bir color picker ekleyelim
  gbf
    .addColor({ color: "#" + mesh.material.color.getHexString() }, "color")
    .onChange((value) => {
      mesh.material.color.set(value);
    });

  const gbp = gbf.addFolder(meshName + " Position");

  gbp.add(mesh.position, "x", -5, 5);
  gbp.add(mesh.position, "y", -5, 5);
  gbp.add(mesh.position, "z", -5, 5);

  const gbr = gbf.addFolder(meshName + " Rotation");
  gbr.add(mesh.rotation, "x", -5, 5);
  gbr.add(mesh.rotation, "y", -5, 5);
  gbr.add(mesh.rotation, "z", -5, 5);
}
