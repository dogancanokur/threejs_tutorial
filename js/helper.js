import { GUI } from "dat.gui";
import * as THREE from "three";

// --------------------------------------------------------------

/**
 * sahneye bir grid helper ekleyelim, bu bize sahnenin zeminini görsel olarak göstermek için yardımcı olur
 */
export function gridHelper() {
  // grid helper, sahnenin zeminini görsel olarak göstermek için yardımcı olur
  const gridHelper = new THREE.GridHelper(5, 10);
  scene.add(gridHelper);

  // xyz eksenlerini göstermek için bir axes helper ekleyelim
  const axesHelper = new THREE.AxesHelper(3);
  //   scene.add(axesHelper);

  const arrowHelper = new THREE.ArrowHelper(
    // yön vektörünü normalize ediyoruz
    new THREE.Vector3(1, 1, 1).normalize(), // yön vektörü (yukarı)
    new THREE.Vector3(0, 0, 0), // başlangıç noktası
    2, // uzunluk
    0xffff00, // renk (sarı)
  );
  //   scene.add(arrowHelper);

  //   const secondCamera = new THREE.PerspectiveCamera(
  //     60,
  //     window.innerWidth / window.innerHeight,
  //     10,
  //     100,
  //   );
  //   secondCamera.position.x = -5;
  //   secondCamera.position.y = -5;
  //   secondCamera.position.z = -5;
  //   const cameraHelper = new THREE.CameraHelper(secondCamera);
  //   scene.add(cameraHelper);
}

export function guiInit() {
  // GUI setup after adding the geometry
  const gui = new GUI();

  cameraConfig(gui);

  function cameraConfig(gui) {
    const cameraFolder = gui.addFolder("Camera Position");
    THREE.warn(
      "Camera position controls added to GUI." + camera.position.toArray(),
    );
    cameraFolder.add(camera.position, "x", -5, 5);
    cameraFolder.add(camera.position, "y", -5, 5);
    cameraFolder.add(camera.position, "z", -5, 5);
  }
  return gui;
}
