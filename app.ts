// Import simulation engine modules.
import { SimulationEngine } from './src/SimulationEngine';
import { SensorSphere } from './src/sensors/SensorSphere';
import { Sensor } from './src/sensors/Sensor';
import { Vector3 } from './src/core/Vector3';
import { Logger } from './src/core/Logger';

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
// HTML Overlay - Extended
// =====================
// Existing overlay for start/pause/time display.
const overlay = document.getElementById('overlay');
// Create a new div for displaying sensor charge info.
const chargeDisplay = document.createElement('div');
chargeDisplay.id = 'chargeDisplay';
chargeDisplay.style.marginTop = '5px';
chargeDisplay.style.fontSize = '14px';
chargeDisplay.innerText = 'Average Charge: 0, Color: #FFFFFF';
overlay?.appendChild(chargeDisplay);
// Create a new debug overlay element appended to the existing overlay.
const debugOverlay = document.createElement('div');
debugOverlay.id = 'debugOverlay';
debugOverlay.style.marginTop = '10px';
debugOverlay.style.fontSize = '14px';
debugOverlay.style.color = '#ffffff';
document.getElementById('overlay')?.appendChild(debugOverlay);

// =====================
// Simulation Engine Setup
// =====================

// For this demo, we are using a single sensor sphere (the container).
const sensorSpheres: SensorSphere[] = [];
const containerSphere = new SensorSphere(
  'Container',
  new Vector3(0, 0, 0),
  7,
  50
);
sensorSpheres.push(containerSphere);

// For visual testing, update a couple of sensor charges:
if (containerSphere.sensors.length >= 2) {
  containerSphere.sensors[0].charge = 5;
  containerSphere.sensors[0].updateColor();
  containerSphere.sensors[1].charge = -5;
  containerSphere.sensors[1].updateColor();
  // Update sphere state to recompute average and color.
  containerSphere.update(0.1);
}

// Aggregate sensors from the container sphere.
const allSensors: Sensor[] = containerSphere.sensors.slice();

// Initialize the SimulationEngine with the aggregated sensors and sensor spheres.
const engine = new SimulationEngine(allSensors, sensorSpheres, 0.05);

// Update the engine's update loop to re-aggregate sensors after each update.
const originalUpdate = engine.update.bind(engine);
engine.update = function () {
  originalUpdate();
  this['sensors'] = this.sensorSpheres.reduce(
    (acc: Sensor[], sphere: SensorSphere) => acc.concat(sphere.sensors),
    []
  );
  // Update the charge overlay with the container's average charge and color.
  const avgCharge = (containerSphere as any)['computeAverageCharge']();
  (
    document.getElementById('chargeDisplay') as HTMLElement
  ).innerText = `Average Charge: ${avgCharge.toFixed(2)}, Color: ${
    containerSphere.color
  }`;
  const debugSummary = Logger.getRunLogSummary();
  document.getElementById('chargeDisplay')!.innerText += ` | ${debugSummary}`;
};

// Expose key objects for integration/testing.
(window as any).engine = engine;
(window as any).sensorSpheres = sensorSpheres;
(window as any).sensors = allSensors;

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
  chargeOffset: 0, // New slider control for adjusting sensor charges.
};

// Add controls to the GUI folder:
const controlFolder = gui.addFolder('Engine Controls');
controlFolder.add(engineControls, 'reset').name('Reset Simulation');
controlFolder.add(engineControls, 'randomize').name('Randomize Sensors');
controlFolder.add(engineControls, 'toggleTime').name('Toggle Time Reversal');
controlFolder
  .add(engineControls, 'impulseStrength', 0, 10)
  .name('Impulse Strength');
// New control: Adjust sensor charge offset for the container sphere.
controlFolder
  .add(engineControls, 'chargeOffset', -10, 10)
  .name('Charge Offset')
  .onChange((offset: number) => {
    containerSphere.sensors.forEach(sensor => {
      sensor.charge = offset;
      sensor.updateColor();
    });
    containerSphere.update(0.1);
  });
controlFolder.add(engine, 'resetAndRestart').name('Reset & Restart'); // Toggle for reset behavior.
controlFolder.open();

// =====================
// Visual Representation: Sensor Meshes
// =====================
// Create meshes for individual sensors using sensor.color.
const sensorMeshes = allSensors.map(sensor => {
  const geometry = new THREE.SphereGeometry(sensor.radius, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: sensor.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return { id: sensor.id, mesh };
});

// Create sensor sphere meshes using the sphere's computed color, rendered as a wireframe.
const sensorSphereMeshes = sensorSpheres.map(sphere => {
  const geometry = new THREE.SphereGeometry(sphere.radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: sphere.color, // Use the computed color from the sensor sphere.
    wireframe: true, // Render as a wireframe.
    transparent: true,
    opacity: 0.3, // Optional: adjust the opacity if desired.
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(sphere.center.x, sphere.center.y, sphere.center.z);
  mesh.userData = { id: sphere.id };
  scene.add(mesh);
  return { id: sphere.id, mesh };
});

// =====================
// Mouse Interaction: Raycasting for Container Impulse
// =====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Raycast against the container's mesh (assumed to be the first sensor sphere mesh).
  const intersects = raycaster.intersectObject(sensorSphereMeshes[0].mesh);
  if (intersects.length > 0 && containerSphere) {
    const impulse = new Vector3(0, engineControls.impulseStrength, 0);
    containerSphere.applyImpulse(impulse);

    // eslint-disable-next-line no-console
    console.log(`Applied impulse ${impulse.toString()} to container sphere.`);
  }
});

// =====================
// Main Animation Loop
// =====================

// In the animation loop, update the debug overlay.
function animate(): void {
  requestAnimationFrame(animate);
  engine.update();

  // Update sensor mesh positions.
  allSensors.forEach(sensor => {
    const meshEntry = sensorMeshes.find(s => s.id === sensor.id);
    if (meshEntry) {
      meshEntry.mesh.position.set(
        sensor.position.x,
        sensor.position.y,
        sensor.position.z
      );
    }
  });

  // Update sphere mesh positions and colors.
  sensorSphereMeshes.forEach(entry => {
    const sphereSim = sensorSpheres.find(s => s.id === entry.id);
    if (sphereSim) {
      entry.mesh.position.set(
        sphereSim.center.x,
        sphereSim.center.y,
        sphereSim.center.z
      );
      (entry.mesh.material as THREE.MeshBasicMaterial).color.set(
        sphereSim.color
      );
    }
  });

  // Update debug overlay with current average sensor charge and sphere color.
  const avgCharge =
    containerSphere.sensors.reduce((sum, s) => sum + s.charge, 0) /
    containerSphere.sensors.length;
  debugOverlay.innerText = `Average Charge: ${avgCharge.toFixed(
    2
  )} | Sphere Color: ${containerSphere.color}`;

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
