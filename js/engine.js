import * as THREE from "three";
import { GUI } from "dat.gui";
import { createBoxGeometry } from "./createGeometry";

// --------------------------------------------------------------

let scene, camera, renderer;

function createScene() {
  // 3 temel öge oluşturuyoruz: sahne, kamera ve renderleyici
  window.scene = scene = new THREE.Scene();

  // Kamera oluştururken, görüş açısı, aspect ratio ve yakın/uzak kesme düzlemlerini belirtiyoruz
  camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near
    1000, // far
  );

  // sahne ve kamerayı birbirine bağlamak için renderleyici oluşturuyoruz
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderleyicinin oluşturduğu canvas elementini HTML sayfasına ekliyoruz
  document.getElementById("webgl-container").appendChild(renderer.domElement);

  // camera.position.z = 5; // kamerayı z ekseninde 5 birim geri çekiyoruz
  camera.position.set(2,2,2); // kamerayı x, y, z eksenlerinde istediğimiz konuma ayarlayabiliriz

  const gui = guiInit();

  // sahneye bir kutu ekleyelim ve sahneye ekleyelim
  // scene.add(createBoxGeometry("green box", 1, 1, 2, 0x00ff00, gui));
  // scene.add(createBoxGeometry("red box", 0.1, 3, 0.2, 0xff0000));
  
  // ** bir posizyon vermezsek, varsayılan olarak (0, 0, 0) noktasında oluşturulur

  
  var cameraLookAtPosition = new THREE.Vector3(0, 0, 0);
  // istersek doğrudan objenin lokasyonuna da çevirebiliriz
  // cameraLookAtPosition.copy(boxMesh.position);

  // kamerayı istediğimiz pozisyona çevirmek için lookAt fonksiyonunu kullanıyoruz
  camera.lookAt(cameraLookAtPosition);

  gridHelper();
  render();
}

// sayfa yüklendiğinde createScene fonksiyonunu çağırarak sahneyi oluşturuyoruz
window.onload = createScene;

/**
 * Sürekli renderlama yapmak için bir güncelleme fonksiyonu çünkü renderleyici sadece bir kez render yapar.
 * Sürekli güncelleme için bu fonksiyonu kullanırız, her frame'de sahneyi yeniden render ederiz ve böylece animasyonlar ve hareketler oluşturabiliriz.
 */
function render() {
  // renderlamayı başlatmak için sahneyi ve kamerayı renderleyiciye veriyoruz
  renderer.render(scene, camera);

  // kutuyu yavaşça döndürmek için her frame'de y ekseninde biraz döndürüyoruz
  /* 
    scene.getObjectByName("green box").rotation.y += 0.01;
    scene.getObjectByName("green box").rotation.x += 0.01;
    scene.getObjectByName("green box").rotation.z += 0.01;
    */

  // render fonksiyonunu sürekli çağırmak için requestAnimationFrame kullanıyoruz
  requestAnimationFrame(render);
}

function guiInit() {
  // GUI setup after adding the geometry
  const gui = new GUI();

  cameraConfig(gui);

  function cameraConfig(gui) {
    const cameraFolder = gui.addFolder("Camera Position");
    THREE.warn("Camera position controls added to GUI." + camera.position.toArray());
    cameraFolder.add(camera.position, "x", -5, 5);
    cameraFolder.add(camera.position, "y", -5, 5);
    cameraFolder.add(camera.position, "z", -5, 5);
  }
  return gui;
}

/**
 * pencere boyutu değiştiğinde kameranın aspect ratio'sunu güncelle ve renderleyicinin boyutunu yeniden ayarla
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

/**
 * sahneye bir grid helper ekleyelim, bu bize sahnenin zeminini görsel olarak göstermek için yardımcı olur
 */
function gridHelper() {
  // grid helper, sahnenin zeminini görsel olarak göstermek için yardımcı olur
  const gridHelper = new THREE.GridHelper(5, 10);
  scene.add(gridHelper);

  // xyz eksenlerini göstermek için bir axes helper ekleyelim
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  const arrowHelper = new THREE.ArrowHelper(
    // yön vektörünü normalize ediyoruz
    new THREE.Vector3(1, 1, 1).normalize(), // yön vektörü (yukarı)
    new THREE.Vector3(0, 0, 0), // başlangıç noktası
    2, // uzunluk
    0xffff00, // renk (sarı)
  );
  scene.add(arrowHelper);
}
