import { Sensor } from './sensors/Sensor';
import { SensorSphere } from './sensors/SensorSphere';
import { GravitySimulator } from './gravity/GravitySimulator';
import { ElectricField } from './electricity/ElectricField';
import { MagneticField } from './magnetism/MagneticField';
import { Logger } from './core/Logger';

export class SimulationEngine {
  private sensors: Sensor[];
  private sensorSpheres: SensorSphere[];
  private deltaTime: number; // time step in seconds
  private running: boolean;
  public globalTime: number;

  /**
   * Creates a new simulation engine.
   * @param sensors - An array of individual sensors.
   * @param sensorSpheres - An array of sensor spheres.
   * @param deltaTime - The time step; default is 0.01 seconds.
   */
  constructor(
    sensors: Sensor[] = [],
    sensorSpheres: SensorSphere[] = [],
    deltaTime: number = 0.01
  ) {
    this.sensors = sensors;
    this.sensorSpheres = sensorSpheres;
    this.deltaTime = deltaTime;
    this.running = false;
    this.globalTime = 0;
  }

  /**
   * Starts the simulation engine.
   */
  public start(): void {
    this.running = true;
    Logger.info('Starting simulation engine.', 'SimulationEngine.start');
    this.loop();
  }

  /**
   * Pauses the simulation engine.
   */
  public pause(): void {
    this.running = false;
    Logger.info('Pausing simulation engine.', 'SimulationEngine.pause');
  }

  /**
   * The main simulation loop.
   * In a browser demo, consider using requestAnimationFrame for smoother visuals.
   */
  private loop(): void {
    if (!this.running) return;

    // Advance simulation time.
    this.globalTime += this.deltaTime;

    // Update sensor spheres.
    this.sensorSpheres.forEach(sphere => {
      sphere.update(this.deltaTime);
    });

    // Update individual sensors.
    this.sensors.forEach(sensor => {
      sensor.update(this.deltaTime);
    });

    // Process interactions among sensor spheres.
    // For now, we simply calculate forces between sensor spheres.
    // This is a placeholder; you can extend it to compute aggregate forces.
    for (let i = 0; i < this.sensorSpheres.length; i++) {
      for (let j = i + 1; j < this.sensorSpheres.length; j++) {
        this.sensorSpheres[i].calculateForces([this.sensorSpheres[j]]);
        this.sensorSpheres[j].calculateForces([this.sensorSpheres[i]]);
      }
    }

    // Process other physics modules (placeholders):
    // e.g., GravitySimulator.simulate(this.sensors, this.deltaTime, 1);
    // Electric and Magnetic fields could be computed for a given evaluation point if needed.

    // Log simulation time.
    Logger.debug(
      `Simulation time: ${this.globalTime.toFixed(3)} s`,
      'SimulationEngine.loop'
    );

    // Schedule next update.
    setTimeout(() => this.loop(), this.deltaTime * 1000);
  }

  /**
   * Adds a sensor to the simulation.
   * @param sensor - The sensor to add.
   */
  public addSensor(sensor: Sensor): void {
    if (!sensor) {
      throw new Error('Sensor cannot be null or undefined.');
    }
    this.sensors.push(sensor);
  }

  /**
   * Adds a sensor sphere to the simulation.
   * @param sphere - The sensor sphere to add.
   */
  public addSensorSphere(sphere: SensorSphere): void {
    if (!sphere) {
      throw new Error('SensorSphere cannot be null or undefined.');
    }
    this.sensorSpheres.push(sphere);
  }
}
