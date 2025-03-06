// Import our simulation engine modules from the src folder.
// Note: Removing the ".ts" extension allows Parcel to detect and compile the files correctly.
import { SimulationEngine } from './src/SimulationEngine';
import { Sensor } from './src/sensors/Sensor';
import { SensorSphere } from './src/sensors/SensorSphere';
import { Vector3 } from './src/core/Vector3';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

// Three.js Setup:
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Set up a Perspective Camera.
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 20);

// Create the WebGL Renderer.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Optional: Set up OrbitControls for easier navigation.
const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate SimulationEngine:
const sensors: Sensor[] = [];
const sensorSpheres: SensorSphere[] = [];

// Create some sample sensors.
for (let i = -5; i <= 5; i += 2) {
  sensors.push(new Sensor(`S${i}`, new Vector3(i, 0, 0)));
}
// Create a sample sensor sphere.
sensorSpheres.push(new SensorSphere('Sphere1', new Vector3(0, 0, 0), 5, 10));

// Initialize the simulation engine with a 0.05 second time step.
const engine = new SimulationEngine(sensors, sensorSpheres, 0.05);

// Create simple Three.js Mesh representations for each sensor.
const sensorMeshes = sensors.map(sensor => {
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return { id: sensor.id, mesh };
});

// Main Animation Loop:
function animate() {
  requestAnimationFrame(animate);
  // Update simulation engine.
  engine.update();
  // Update sensor mesh positions based on simulation state.
  sensors.forEach(sensor => {
    const sensorMesh = sensorMeshes.find(s => s.id === sensor.id);
    if (sensorMesh) {
      sensorMesh.mesh.position.set(
        sensor.position.x,
        sensor.position.y,
        sensor.position.z
      );
    }
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

// UI Controls:
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
