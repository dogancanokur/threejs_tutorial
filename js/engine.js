import * as THREE from "three";

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
  scene.add(createBoxGeometry("green box", 1, 1, 1, 0x00ff00));

  // ** bir posizyon vermezsek, varsayılan olarak (0, 0, 0) noktasında oluşturulur

  // kamerayı biraz geri çekelim ki kutuyu görebilelim
  /*
camera.position.x = 2;
camera.position.y = 2.5;
camera.position.z = 1;
*/
  camera.position.set(2, 2.5, 1);

  var cameraLookAtPosition = new THREE.Vector3(0, 0, 0);
  // istersek doğrudan objenin lokasyonuna da çevirebiliriz
  // cameraLookAtPosition.copy(boxMesh.position);

  // kamerayı istediğimiz pozisyona çevirmek için lookAt fonksiyonunu kullanıyoruz
  camera.lookAt(cameraLookAtPosition);

  render();
}

// sayfa yüklendiğinde createScene fonksiyonunu çağırarak sahneyi oluşturuyoruz
window.onload = createScene;

/**
 * Box geometri oluşturmak için bir fonksiyon
 */
function createBoxGeometry(meshName, width, height, depth, color) {
  let boxGeometry = new THREE.BoxGeometry(width, height, depth);
  // kutunun yüzeyini yeşil renkte göstermek için bir malzeme oluşturuyoruz
  let material = new THREE.MeshBasicMaterial({ color });
  // geometri ve malzemeyi birleştirerek bir mesh oluşturuyoruz
  let mesh = new THREE.Mesh(boxGeometry, material);
  mesh.name = meshName;
  return mesh;
}

/**
 * Sürekli renderlama yapmak için bir güncelleme fonksiyonu çünkü renderleyici sadece bir kez render yapar.
 * Sürekli güncelleme için bu fonksiyonu kullanırız, her frame'de sahneyi yeniden render ederiz ve böylece animasyonlar ve hareketler oluşturabiliriz.
 */
function render() {
  // renderlamayı başlatmak için sahneyi ve kamerayı renderleyiciye veriyoruz
  renderer.render(scene, camera);
  scene.getObjectByName("green box").rotation.y += 0.01; // kutuyu yavaşça döndürmek için her frame'de y ekseninde biraz döndürüyoruz
  scene.getObjectByName("green box").rotation.x += 0.01;
  scene.getObjectByName("green box").rotation.z += 0.01;

  // render fonksiyonunu sürekli çağırmak için requestAnimationFrame kullanıyoruz
  requestAnimationFrame(render);
}
