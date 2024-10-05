// src/main.js

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Seleciona o contêiner onde o renderizador será anexado
const container = document.getElementById("container");

// Cria a cena
const scene = new THREE.Scene();

// Define a câmera (perspectiva)
const camera = new THREE.PerspectiveCamera(
  75, // Campo de visão
  window.innerWidth / window.innerHeight, // Proporção
  0.1, // Plano próximo
  1000 // Plano distante
);

// Configura a posição da câmera
camera.position.set(0, 1.6, 3); // Ajuste conforme necessário

// Cria o renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Adiciona controles de órbita para interatividade
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza o movimento
controls.dampingFactor = 0.05;

// Adiciona uma luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Adiciona uma luz direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Carrega o modelo GLB
const loader = new GLTFLoader();
loader.load(
  "../public/models/model_test.glb", // Caminho para o modelo 3D
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Opcional: Ajusta a escala e a posição do modelo
    model.scale.set(1, 1, 1); // Ajuste conforme necessário
    model.position.set(0, 0, 0); // Ajuste conforme necessário

    // Opcional: Se o modelo tiver animações
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
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
