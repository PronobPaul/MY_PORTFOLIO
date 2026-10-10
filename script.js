import * as THREE from "three";

const canvas = document.querySelector("#scene");
const host = canvas.parentElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 8.5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.AmbientLight(0x9cbaff, 1.7));
const keyLight = new THREE.PointLight(0x32dfff, 28, 12);
keyLight.position.set(-3, 3, 4);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0xa15bff, 32, 12);
rimLight.position.set(3, -1, 2);
scene.add(rimLight);

// Everything inside this group moves together as a 3D card.
const cardGroup = new THREE.Group();
scene.add(cardGroup);

// Thin blue glass-like plate behind the portrait.
const plate = new THREE.Mesh(
  new THREE.BoxGeometry(3.45, 4.45, 0.13),
  new THREE.MeshPhysicalMaterial({
    color: 0x102a78,
    metalness: 0.35,
    roughness: 0.22,
    transmission: 0.08,
    transparent: true,
    opacity: 0.76,
    clearcoat: 1,
    emissive: 0x061d70,
    emissiveIntensity: 0.8
  })
);
plate.position.z = -0.13;
cardGroup.add(plate);

// Glowing frame made from a rectangular line loop.
const framePoints = [
  new THREE.Vector3(-1.73, -2.23, 0.01),
  new THREE.Vector3( 1.73, -2.23, 0.01),
  new THREE.Vector3( 1.73,  2.23, 0.01),
  new THREE.Vector3(-1.73,  2.23, 0.01)
];
const frameGeometry = new THREE.BufferGeometry().setFromPoints(framePoints);
const frameMaterial = new THREE.LineLoop(
  frameGeometry,
  new THREE.LineBasicMaterial({ color: 0x43eaff })
);
frameMaterial.position.z = 0.02;
cardGroup.add(frameMaterial);

// A second, purple frame gives the scene a layered glow.
const frame2 = new THREE.LineLoop(
  frameGeometry,
  new THREE.LineBasicMaterial({ color: 0x9b5cff, transparent: true, opacity: 0.75 })
);
frame2.scale.set(1.035, 1.035, 1);
frame2.position.set(0.035, -0.015, -0.22);
cardGroup.add(frame2);

// Load your transparent PNG portrait.
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  "./assets/profile.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const image = texture.image;
    const aspect = image.width / image.height;
    const height = 4.05;
    const width = height * aspect;
    const portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.03,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    portrait.position.set(0, -0.05, 0.13);
    cardGroup.add(portrait);
  },
  undefined,
  (error) => console.error("Could not load assets/profile.png", error)
);

// Floating ring behind the card.
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.75, 0.018, 12, 120),
  new THREE.MeshBasicMaterial({ color: 0x437cff, transparent: true, opacity: 0.85 })
);
ring.position.set(0, 0.05, -0.65);
ring.rotation.set(0.45, 0.25, -0.25);
scene.add(ring);

// Glowing circular pedestal under the card.
const pedestal = new THREE.Group();
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.65, 1.8, 0.16, 64),
  new THREE.MeshStandardMaterial({
    color: 0x111d53, metalness: 0.7, roughness: 0.24,
    emissive: 0x111b8a, emissiveIntensity: 0.8
  })
);
base.position.y = -2.5;
pedestal.add(base);

const rim = new THREE.Mesh(
  new THREE.TorusGeometry(1.67, 0.025, 10, 100),
  new THREE.MeshBasicMaterial({ color: 0x3ce7ff })
);
rim.rotation.x = Math.PI / 2;
rim.position.y = -2.41;
pedestal.add(rim);
pedestal.position.z = -0.1;
scene.add(pedestal);

// Small glowing particles add depth to the hero scene.
const particleCount = 95;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 7;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0x78cfff, size: 0.025, transparent: true, opacity: 0.75,
    sizeAttenuation: true
  })
);
scene.add(particles);

let targetX = 0;
let targetY = 0;
let pointerActive = false;

function updatePointer(clientX, clientY) {
  const rect = host.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  const y = (clientY - rect.top) / rect.height;
  targetY = (x - 0.5) * 0.48;
  targetX = (0.5 - y) * 0.32;
  pointerActive = true;
}

host.addEventListener("pointermove", (event) => {
  updatePointer(event.clientX, event.clientY);
});
host.addEventListener("pointerleave", () => {
  targetX = 0;
  targetY = 0;
  pointerActive = false;
});

function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.position.z = width < 500 ? 10 : width < 850 ? 9.2 : 8.5;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Smoothly ease the card toward the pointer instead of snapping.
  cardGroup.rotation.x += (targetX + Math.sin(t * 0.7) * 0.025 - cardGroup.rotation.x) * 0.045;
  cardGroup.rotation.y += (targetY + Math.sin(t * 0.55) * 0.035 - cardGroup.rotation.y) * 0.045;
  cardGroup.position.y = Math.sin(t * 0.9) * 0.07;

  ring.rotation.z = t * 0.12;
  ring.rotation.y = 0.25 + Math.sin(t * 0.4) * 0.08;
  pedestal.rotation.y = Math.sin(t * 0.35) * 0.06;
  particles.rotation.y = t * 0.025;
  particles.rotation.x = Math.sin(t * 0.2) * 0.025;

  renderer.render(scene, camera);
}
animate();
