import { Sensor } from './sensors/Sensor';
import { SensorSphere } from './sensors/SensorSphere';
import { GravitySimulator } from './gravity/GravitySimulator';
import { ElectricField } from './electricity/ElectricField';
import { MagneticField } from './magnetism/MagneticField';
import { Logger } from './core/Logger';

/**
 * SimulationEngine orchestrates the simulation by updating sensors,
 * sensor spheres, and processing interactions among various physics modules.
 */
export class SimulationEngine {
  private sensors: Sensor[];
  private sensorSpheres: SensorSphere[];
  private deltaTime: number; // Time step in seconds.
  private running: boolean;
  public globalTime: number;

  /**
   * Creates a new simulation engine instance.
   * @param sensors - An array of individual sensors.
   * @param sensorSpheres - An array of sensor spheres.
   * @param deltaTime - The simulation time step; default is 0.01 seconds.
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
   * Public update method: Advances the simulation by one time step.
   * Updates sensor spheres and sensors, processes interactions, and advances global time.
   */
  public update(): void {
    if (!this.running) return;

    // Advance global simulation time.
    this.globalTime += this.deltaTime;

    // Update each sensor sphere.
    this.sensorSpheres.forEach(sphere => {
      sphere.update(this.deltaTime);
    });

    // Update each individual sensor.
    this.sensors.forEach(sensor => {
      sensor.update(this.deltaTime);
    });

    // Process interactions among sensor spheres.
    for (let i = 0; i < this.sensorSpheres.length; i++) {
      for (let j = i + 1; j < this.sensorSpheres.length; j++) {
        this.sensorSpheres[i].calculateForces([this.sensorSpheres[j]]);
        this.sensorSpheres[j].calculateForces([this.sensorSpheres[i]]);
      }
    }

    // Log simulation time.
    Logger.debug(
      `Simulation time: ${this.globalTime.toFixed(3)} s`,
      'SimulationEngine.update'
    );
  }

  /**
   * The main simulation loop.
   * In a browser demo, you may consider using requestAnimationFrame for smoother updates.
   */
  private loop(): void {
    if (!this.running) return;
    this.update();
    // Schedule the next update.
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
