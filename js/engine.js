import * as THREE from "three";
import { GUI } from "dat.gui";
import { createBoxGeometry } from "./createGeometry";

// --------------------------------------------------------------

let scene, camera, renderer;

function createScene() {
  // 3 temel öge oluşturuyoruz: sahne, kamera ve renderleyici
  scene = new THREE.Scene();

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

  // sahneye bir kutu ekleyelim ve sahneye ekleyelim
  scene.add(createBoxGeometry("green box", 1, 1, 2, 0x00ff00));
  scene.add(createBoxGeometry("red box", 0.1, 3, 0.2, 0xff0000));

  // ** bir posizyon vermezsek, varsayılan olarak (0, 0, 0) noktasında oluşturulur

  // kamerayı biraz geri çekelim ki kutuyu görebilelim
  // 3D uzayında kameranın konumunu belirlemek için position özelliğini kullanırız
  // camera.position.z = 5; // kamerayı z ekseninde 5 birim geri çekiyoruz
  camera.position.set(2, 2.5, 1);

  var cameraLookAtPosition = new THREE.Vector3(0, 0, 0);
  // istersek doğrudan objenin lokasyonuna da çevirebiliriz
  // cameraLookAtPosition.copy(boxMesh.position);

  // kamerayı istediğimiz pozisyona çevirmek için lookAt fonksiyonunu kullanıyoruz
  camera.lookAt(cameraLookAtPosition);

  gui();

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

function gui() {
  // GUI setup after adding the geometry
  const gui = new GUI();

  greenBoxConfig();

  cameraConfig();

  function cameraConfig() {
    const cameraFolder = gui.addFolder("Camera Position");
    cameraFolder.add(camera.position, "x", -5, 5);
    cameraFolder.add(camera.position, "y", -5, 5);
    cameraFolder.add(camera.position, "z", -5, 5);
  }

  function greenBoxConfig() {
    const gbf = gui.addFolder("Green Box");
    // renk değiştirme için bir color picker ekleyelim
    gbf.addColor({ color: "#00ff00" }, "color").onChange((value) => {
      scene.getObjectByName("green box").material.color.set(value);
    });

    const gbp = gbf.addFolder("Green Box Position");
    gbp.add(scene.getObjectByName("green box").position, "x", -5, 5);
    gbp.add(scene.getObjectByName("green box").position, "y", -5, 5);
    gbp.add(scene.getObjectByName("green box").position, "z", -5, 5);

    const gbr = gbf.addFolder("Green Box Rotation");
    gbr.add(scene.getObjectByName("green box").rotation, "x", -5, 5);
    gbr.add(scene.getObjectByName("green box").rotation, "y", -5, 5);
    gbr.add(scene.getObjectByName("green box").rotation, "z", -5, 5);
  }
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
