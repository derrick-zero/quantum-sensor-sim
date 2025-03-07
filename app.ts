// Import simulation engine modules.
import { SimulationEngine } from './src/SimulationEngine';
import { Sensor } from './src/sensors/Sensor';
import { SensorSphere } from './src/sensors/SensorSphere';
import { Vector3 } from './src/core/Vector3';

// Import Three.js and OrbitControls from three-stdlib.
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

// Import lil-gui for real-time parameter control.
import { GUI } from 'lil-gui';

// =====================
// Three.js Setup
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ambient and directional light.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Setup OrbitControls.
const controls = new OrbitControls(camera, renderer.domElement);

// Handle window resizing.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =====================
// Simulation Engine Setup
// =====================

// Create sensors with random initial positions for demonstration.
const sensors: Sensor[] = [];
for (let i = 0; i < 20; i++) {
  const pos = new Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  // Optionally add random velocities.
  const vel = new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  );
  sensors.push(new Sensor(`S${i}`, pos, vel));
}

// Create sensor spheres. We'll use one sensor sphere as the container.
const sensorSpheres: SensorSphere[] = [];
const containerSphere = new SensorSphere(
  'Container',
  new Vector3(0, 0, 0),
  7,
  20
);
sensorSpheres.push(containerSphere);

// Initialize the simulation engine with deltaTime = 0.05 sec.
const engine = new SimulationEngine(sensors, sensorSpheres, 0.05);

// =====================
// GUI Setup with lil-gui
// =====================
const gui = new GUI();
const simFolder = gui.addFolder('Simulation Parameters');

// Time step controller.
simFolder
  .add(engine, 'deltaTime', 0.005, 0.1)
  .name('Time Step')
  .onChange((value: number) => {
    engine.deltaTime = value;
  });

// Display global simulation time.
simFolder.add(engine, 'globalTime').name('Global Time').listen();

// Engine controls: Reset, Randomize, Toggle Time Reversal.
const controlParams = {
  impulseStrength: 1, // For bump impulse.
  reset: () => engine.reset(),
  randomize: () => engine.randomize(),
  toggleTime: () => engine.toggleTimeReversal(),
};
const controlFolder = gui.addFolder('Engine Controls');
controlFolder.add(controlParams, 'reset').name('Reset Simulation');
controlFolder.add(controlParams, 'randomize').name('Randomize Sensors');
controlFolder.add(controlParams, 'toggleTime').name('Toggle Time Reversal');
controlFolder
  .add(controlParams, 'impulseStrength', 0, 10)
  .name('Impulse Strength');
simFolder.open();
controlFolder.open();

// =====================
// Visual Representation
// =====================

// Create sensor meshes for individual sensors.
const sensorMeshes = sensors.map(sensor => {
  const geometry = new THREE.SphereGeometry(sensor.radius, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: sensor.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return { id: sensor.id, mesh };
});

// Create a mesh for the container sensor sphere as a wireframe.
const containerGeometry = new THREE.SphereGeometry(
  containerSphere.radius,
  16,
  16
);
const containerMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  opacity: 0.3,
  transparent: true,
});
const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
containerMesh.position.set(
  containerSphere.center.x,
  containerSphere.center.y,
  containerSphere.center.z
);
scene.add(containerMesh);

// =====================
// Mouse Interaction: Raycasting for "Bumping" Sensor Spheres
// =====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Raycast against the container mesh.
  const intersects = raycaster.intersectObject(containerMesh);
  if (intersects.length > 0) {
    // Apply an impulse to the container sensor sphere.
    const impulse = new Vector3(0, controlParams.impulseStrength, 0);
    containerSphere.applyImpulse(impulse);
    console.log(`Applied impulse ${impulse.toString()} to container sphere.`);
  }
});

// =====================
// Main Animation Loop
// =====================
function animate() {
  requestAnimationFrame(animate);

  // Update the simulation engine.
  engine.update();

  // Update sensor meshes.
  sensors.forEach(sensor => {
    const sMesh = sensorMeshes.find(s => s.id === sensor.id);
    if (sMesh) {
      sMesh.mesh.position.set(
        sensor.position.x,
        sensor.position.y,
        sensor.position.z
      );
    }
  });

  // Update container mesh position.
  containerMesh.position.set(
    containerSphere.center.x,
    containerSphere.center.y,
    containerSphere.center.z
  );

  controls.update();
  renderer.render(scene, camera);
}
animate();

// =====================
// HTML Overlay Controls: Start and Pause Buttons
// =====================
const startButton = document.getElementById('start');
if (startButton) {
  startButton.addEventListener('click', () => {
    engine.start();
  });
}

const pauseButton = document.getElementById('pause');
if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    engine.pause();
  });
}

setInterval(() => {
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay) {
    timeDisplay.innerText = `Time: ${engine.globalTime.toFixed(2)} s`;
  }
}, 100);
