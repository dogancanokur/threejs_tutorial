import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gridHelper, guiInit as datGuiInit } from "./helper";
import { createBoxGeometry } from "./createGeometry";

// --------------------------------------------------------------

let scene, camera, renderer;

function createScene() {
  // 3 temel öge oluşturuyoruz: sahne, kamera ve renderleyici
  window.scene = scene = new THREE.Scene();

  // Kamera oluştururken, görüş açısı, aspect ratio ve yakın/uzak kesme düzlemlerini belirtiyoruz
  window.camera = camera = new THREE.PerspectiveCamera(
    40, // fov
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near
    1000, // far
  );

  // sahne ve kamerayı birbirine bağlamak için renderleyici oluşturuyoruz
  window.renderer = renderer = new THREE.WebGLRenderer({
    antialias: true, // kenar yumuşatma, daha pürüzsüz görseller için
    physicallyCorrectLights: true, // fiziksel olarak doğru ışıklandırma modelini kullanarak daha gerçekçi aydınlatma sağlar, bu özellikle MeshStandardMaterial gibi fizik tabanlı malzemelerle çalışırken önemlidir
    powerPreference: "high-performance", // performans tercihi, mümkün olan en iyi performansı sağlamak için tarayıcıya bir ipucu verir, alternarif olarak "low-power" veya "default" kullanılabilir
  });
  renderer.shadowMap.enabled = true; // gölge haritalarını etkinleştiriyoruz çünkü MeshStandardMaterial kullanıyoruz ve gölgelerin görünmesi için bu gerekli

  renderer.setSize(window.innerWidth, window.innerHeight); // sahne boyutunu pencere boyutuna göre ayarlıyoruz
  renderer.setClearColor(0x202020); // arkaplan rengini ayarlar

  document.getElementById("webgl-container").appendChild(renderer.domElement); // renderleyicinin oluşturduğu canvas elementini HTML sayfasına ekliyoruz

  camera.position.set(2, 4, 6); // kamerayı x, y, z eksenlerinde istediğimiz konuma ayarlayabiliriz

  const datGui = datGuiInit();

  // sahneye bir kutu ekleyelim ve sahneye ekleyelim
  scene.add(
    createBoxGeometry("green box", 1, 1, 1, 0x00ff00, 0, 0.5, 0, datGui),
  );
  scene.add(createBoxGeometry("floor",5, 1, 5, 0xf0000a, 0, -0.5, 0));

  // ** bir posizyon vermezsek, varsayılan olarak (0, 0, 0) noktasında oluşturulur

  // kamerayı istediğimiz pozisyona çevirmek için lookAt fonksiyonunu kullanıyoruz
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const spotLight = new THREE.SpotLight(0xffffff, 100);
  spotLight.position.set(2, 4, 6);
  spotLight.castShadow = true;
  scene.add(spotLight);

  gridHelper();

  //   createGLTFModel(
  // "models/airbus/scene.gltf",
  // "models/airbus/textures/material02_baseColor.jpg",
  // "airbus1",
  //   );
  render();
}

// sayfa yüklendiğinde createScene fonksiyonunu çağırarak sahneyi oluşturuyoruz
window.onload = createScene;

function createGLTFModel(gltfPath, texturePath, meshName) {
  const textureLoader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(gltfPath, function (gltf) {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    gltf.scene.material = material;
    gltf.scene.name = meshName;
    scene.add(gltf.scene);
  });
}

/**
 * Sürekli renderlama yapmak için bir güncelleme fonksiyonu çünkü renderleyici sadece bir kez render yapar.
 * Sürekli güncelleme için bu fonksiyonu kullanırız, her frame'de sahneyi yeniden render ederiz ve böylece animasyonlar ve hareketler oluşturabiliriz.
 */
function render() {
  // renderlamayı başlatmak için sahneyi ve kamerayı renderleyiciye veriyoruz
  renderer.render(scene, camera);

  // kutuyu yavaşça döndürmek için her frame'de y ekseninde biraz döndürüyoruz
  //   if (scene.getObjectByName("green box")) {
  //     scene.getObjectByName("green box").rotation.y += 0.005;
  //   }

  if (scene.getObjectByName("airbus1")) {
    scene.getObjectByName("airbus1").rotation.y += 0.005;
  }

  // render fonksiyonunu sürekli çağırmak için requestAnimationFrame kullanıyoruz
  requestAnimationFrame(render);
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
