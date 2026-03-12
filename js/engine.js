import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gridHelper, guiInit as datGuiInit } from "./helper";
import createBoxGeometry from "./createGeometry";

// --------------------------------------------------------------

let scene, camera, renderer, datGui;

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

  datGui = datGuiInit();

  // sahneye bir kutu ekleyelim ve sahneye ekleyelim
  scene.add(
    createBoxGeometry(
      "green box",
      1,
      1,
      1,
      0x00ff00,
      0,
      0.5,
      0,
      true,
      true,
      datGui,
    ),
  );
  scene.add(
    createBoxGeometry("floor", 5, 1, 5, 0xf0000a, 0, -0.5, 0, true, true),
  );

  // ** bir posizyon vermezsek, varsayılan olarak (0, 0, 0) noktasında oluşturulur

  // kamerayı istediğimiz pozisyona çevirmek için lookAt fonksiyonunu kullanıyoruz
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  spawnSpotLight();

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

function spawnSpotLight() {
  const spotLight = new THREE.SpotLight(0xffffff, 10);
  spotLight.position.set(2, 3, 3);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.name = "spotLight";
  scene.add(spotLight);

  let spotLightGui = datGui.addFolder("Spot Light Properties");
  spotLightGui.add(scene.getObjectByName("spotLight"), "penumbra", 0, 1); // penumbra, spot ışığının kenarlarının ne kadar yumuşak olduğunu kontrol eder, 0 tam keskin kenarlar, 1 ise tamamen yumuşak ken
  spotLightGui.add(scene.getObjectByName("spotLight"), "intensity", 0, 100); // intensity, ışığın parlaklığını kontrol eder, 0 hiç ışık yok, 100 çok parlak ışık
  spotLightGui.add(scene.getObjectByName("spotLight"), "distance", 0, 10); // distance, ışığın etkili olduğu maksimum mesafeyi kontrol eder, 0 ise sonsuz mesafe, 10 ise 10 birim uzaklığa kadar etkili olur
  spotLightGui.add(scene.getObjectByName("spotLight"), "decay", 0, 100); // decay, ışığın mesafeye göre ne kadar hızlı azaldığını kontrol eder, 0 ise hiç azalma olmaz, 1 ise gerçek dünyadaki gibi azalma olur, 2 ise daha hızlı azalma olur
  spotLightGui.add(scene.getObjectByName("spotLight"), "power", 0, 100); // power, ışığın toplam gücünü kontrol eder, 0 hiç ışık yok, 100 çok güçlü ışık

  spotLightGui.add(scene.getObjectByName("spotLight").position, "x", -10, 10);
  spotLightGui.add(scene.getObjectByName("spotLight").position, "y", -10, 10);
  spotLightGui.add(scene.getObjectByName("spotLight").position, "z", -10, 10);
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
