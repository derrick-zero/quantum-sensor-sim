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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Handle window resize events.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =====================
// Simulation Engine Setup
// =====================

// Generate a set of sensors with random positions and velocities.
const sensors: Sensor[] = [];
for (let i = 0; i < 20; i++) {
  const pos = new Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  const vel = new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  );
  sensors.push(new Sensor(`S${i}`, pos, vel));
}

// Create several sensor spheres; designate the first as the container.
const sensorSpheres: SensorSphere[] = [];
const containerSphere = new SensorSphere(
  'Container',
  new Vector3(0, 0, 0),
  7,
  50
);
sensorSpheres.push(containerSphere);
// Optionally add additional sensor spheres (for hierarchical grouping)
for (let i = 1; i < 3; i++) {
  // Position additional spheres offset from the container for demonstration.
  sensorSpheres.push(
    new SensorSphere(`Sphere${i}`, new Vector3(i * 5, 0, 0), 3, 20)
  );
}

// Initialize the SimulationEngine with a 0.05-second time step.
const engine = new SimulationEngine(sensors, sensorSpheres, 0.05);

// =====================
// GUI Setup with lil-gui
// =====================
const gui = new GUI();
const simFolder = gui.addFolder('Simulation Parameters');
simFolder
  .add(engine, 'deltaTime', 0.005, 0.1)
  .name('Time Step')
  .onChange((value: number) => {
    engine.deltaTime = value;
  });
simFolder.add(engine, 'globalTime').name('Global Time').listen();
simFolder.open();

const engineControls = {
  impulseStrength: 1,
  reset: () => engine.reset(),
  randomize: () => engine.randomize(),
  toggleTime: () => engine.toggleTimeReversal(),
};

const controlFolder = gui.addFolder('Engine Controls');
controlFolder.add(engineControls, 'reset').name('Reset Simulation');
controlFolder.add(engineControls, 'randomize').name('Randomize Sensors');
controlFolder.add(engineControls, 'toggleTime').name('Toggle Time Reversal');
controlFolder
  .add(engineControls, 'impulseStrength', 0, 10)
  .name('Impulse Strength');
controlFolder.open();

// =====================
// Visual Representation: Sensor Meshes
// =====================
// Create sensor meshes based on sensor properties.
const sensorMeshes = sensors.map(sensor => {
  const geometry = new THREE.SphereGeometry(sensor.radius, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: sensor.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return { id: sensor.id, mesh };
});

// Create meshes for sensor spheres; use a wireframe for container visualization.
const sensorSphereMeshes = sensorSpheres.map(sphere => {
  const geometry = new THREE.SphereGeometry(sphere.radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(sphere.center.x, sphere.center.y, sphere.center.z);
  // Tag mesh with sensor sphere ID for raycasting.
  mesh.userData = { id: sphere.id };
  scene.add(mesh);
  return { id: sphere.id, mesh };
});

// =====================
// Mouse Interaction: Raycasting for Bumping Container
// =====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  // Raycast against the container mesh.
  const intersects = raycaster.intersectObject(sensorSphereMeshes[0].mesh);
  if (intersects.length > 0 && containerSphere) {
    const impulse = new Vector3(0, engineControls.impulseStrength, 0);
    containerSphere.applyImpulse(impulse);
    console.log(`Applied impulse ${impulse.toString()} to container sphere.`);
  }
});

// =====================
// Main Animation Loop
// =====================
function animate() {
  requestAnimationFrame(animate);

  // Update simulation engine.
  engine.update();

  // Update sensor meshes.
  sensors.forEach(sensor => {
    const meshEntry = sensorMeshes.find(s => s.id === sensor.id);
    if (meshEntry) {
      meshEntry.mesh.position.set(
        sensor.position.x,
        sensor.position.y,
        sensor.position.z
      );
    }
  });

  // Update sensor sphere (container) meshes.
  sensorSphereMeshes.forEach(entry => {
    const sphere = sensorSpheres.find(s => s.id === entry.id);
    if (sphere) {
      entry.mesh.position.set(
        sphere.center.x,
        sphere.center.y,
        sphere.center.z
      );
    }
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// =====================
// HTML Overlay Controls: Start and Pause Buttons
// =====================
const startButton = document.getElementById('start');
if (startButton) {
  startButton.addEventListener('click', () => engine.start());
}

const pauseButton = document.getElementById('pause');
if (pauseButton) {
  pauseButton.addEventListener('click', () => engine.pause());
}

setInterval(() => {
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay) {
    timeDisplay.innerText = `Time: ${engine.globalTime.toFixed(2)} s`;
  }
}, 100);
