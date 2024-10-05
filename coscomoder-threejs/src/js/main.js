import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Seleciona a div "container-card" que está no HTML
const container = document.getElementById("container-card");

// Cria a cena
const scene = new THREE.Scene();

// Define a câmera (perspectiva)
const camera = new THREE.PerspectiveCamera(
  45, // Campo de visão ajustado para um valor menor para "afastar" e capturar melhor o modelo
  container.clientWidth / container.clientHeight, // Proporção adaptada ao container
  0.1,
  1000
);

// Configura a posição da câmera
camera.position.set(0, 0, 10); // Ajuste a posição para uma distância maior para capturar o modelo inteiro
camera.lookAt(0, 0, 0); // Garante que a câmera olhe para o centro da cena

// Cria o renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Adiciona controles de órbita para interatividade
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Adiciona uma luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Aumentei a intensidade da luz
scene.add(ambientLight);

// Adiciona uma luz hemisférica para iluminação geral
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
scene.add(hemisphereLight);

// Adiciona uma luz direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Carrega o modelo GLB
const loader = new GLTFLoader();
loader.load(
  "/models/model_test.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Ajusta a escala do modelo
    model.scale.set(0.8, 0.8, 0.8); // Ajuste a escala conforme necessário para caber melhor no card

    // Ajusta a posição do modelo para garantir que esteja centralizado
    model.position.set(0, -7, 0); // Ajuste o eixo Y se necessário para centralizar

    // Se o modelo tiver animações
    if (gltf.animations && gltf.animations.length) {
      const mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      const clock = new THREE.Clock();
      function animateWithAnimation() {
        requestAnimationFrame(animateWithAnimation);
        const delta = clock.getDelta();
        mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
      }
      animateWithAnimation();
      return;
    }
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% carregado");
  },
  function (error) {
    console.error("Ocorreu um erro ao carregar o modelo:", error);
  }
);

// Função de animação
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Atualiza os controles
  renderer.render(scene, camera);
}

// Inicia a animação
animate();

// Ajusta o renderizador e a câmera quando a janela for redimensionada
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
