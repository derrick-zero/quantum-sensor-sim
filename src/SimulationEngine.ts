import { Sensor } from './sensors/Sensor';
import { SensorSphere } from './sensors/SensorSphere';
import { GravitySimulator } from './gravity/GravitySimulator';
import { ElectricField } from './electricity/ElectricField';
import { MagneticField } from './magnetism/MagneticField';
import { Logger } from './core/Logger';
import { Vector3 } from './core/Vector3';

/**
 * SimulationEngine orchestrates the simulation by updating sensors,
 * sensor spheres, processing physics interactions, handling sensor-sensor collisions,
 * and enforcing container boundaries.
 */
export class SimulationEngine {
  private sensors: Sensor[];
  private sensorSpheres: SensorSphere[];
  public deltaTime: number; // Time step in seconds.
  private running: boolean;
  public globalTime: number;
  private timeReversed: boolean;

  // For reset/randomize, store initial states.
  private initialSensorsState: Sensor[];
  private initialSensorSpheresState: SensorSphere[];

  // We'll designate one sensor sphere as the container.
  // For simplicity, assume the first sensor sphere is the container.
  public container: SensorSphere | null;

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
    this.timeReversed = false;
    this.container = sensorSpheres.length > 0 ? sensorSpheres[0] : null;

    // Clone initial states for reset.
    this.initialSensorsState = sensors.map(s => this.cloneSensor(s));
    this.initialSensorSpheresState = sensorSpheres.map(ss =>
      this.cloneSensorSphere(ss)
    );
  }

  // Helper for cloning a sensor.
  private cloneSensor(sensor: Sensor): Sensor {
    // Create a new Sensor with same basic parameters.
    return new Sensor(
      sensor.id,
      sensor.position.clone(),
      sensor.velocity.clone(),
      sensor.mass,
      sensor.charge,
      sensor.state
    );
  }

  // Helper for cloning a sensor sphere.
  private cloneSensorSphere(sphere: SensorSphere): SensorSphere {
    // Note: For simplicity, we clone using basic parameters.
    return new SensorSphere(
      sphere.id,
      sphere.center.clone(),
      sphere.radius,
      sphere.sensors.length,
      sphere.state
    );
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
   * Toggles time reversal.
   */
  public toggleTimeReversal(): void {
    this.timeReversed = !this.timeReversed;
    Logger.info(
      `Time reversal toggled. Now ${
        this.timeReversed ? 'reversed' : 'forward'
      }.`,
      'SimulationEngine.toggleTimeReversal'
    );
  }

  /**
   * Resets the simulation engine to its initial state.
   */
  public reset(): void {
    this.globalTime = 0;
    this.sensors = this.initialSensorsState.map(s => this.cloneSensor(s));
    this.sensorSpheres = this.initialSensorSpheresState.map(ss =>
      this.cloneSensorSphere(ss)
    );
    // Reassign container if available.
    this.container =
      this.sensorSpheres.length > 0 ? this.sensorSpheres[0] : null;
    Logger.info('Simulation has been reset.', 'SimulationEngine.reset');
  }

  /**
   * Randomizes sensor positions and velocities.
   */
  public randomize(): void {
    this.sensors.forEach(sensor => {
      sensor.position = new Vector3(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      sensor.velocity = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
    });
    Logger.info('Sensors have been randomized.', 'SimulationEngine.randomize');
  }

  /**
   * Public update method: Advances the simulation by one time step,
   * updating sensor spheres, sensors, processing interactions, collisions,
   * and enforcing container boundaries.
   */
  public update(): void {
    if (!this.running) return;

    // Determine simulation step based on time reversal.
    const step = this.timeReversed ? -this.deltaTime : this.deltaTime;
    this.globalTime += step;

    // Update sensor spheres.
    this.sensorSpheres.forEach(sphere => sphere.update(step));

    // Update individual sensors.
    this.sensors.forEach(sensor => sensor.update(step));

    // Handle sensor-sensor collisions.
    this.handleSensorCollisions();

    // Process interactions among sensor spheres (placeholder).
    for (let i = 0; i < this.sensorSpheres.length; i++) {
      for (let j = i + 1; j < this.sensorSpheres.length; j++) {
        this.sensorSpheres[i].calculateForces([this.sensorSpheres[j]]);
        this.sensorSpheres[j].calculateForces([this.sensorSpheres[i]]);
      }
    }

    // Enforce container boundary, if a container is defined.
    if (this.container) {
      this.sensors.forEach(sensor => {
        this.handleContainerCollision(sensor, this.container!);
      });
    }

    Logger.debug(
      `Simulation time: ${this.globalTime.toFixed(3)} s`,
      'SimulationEngine.update'
    );
  }

  /**
   * Main simulation loop.
   * In a browser demo, consider using requestAnimationFrame for smoother visuals.
   */
  private loop(): void {
    if (!this.running) return;
    this.update();
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

  /**
   * Handles collisions between individual sensors using a simple elastic collision model.
   * Assumes each sensor has a "radius" property (defaulting to 0.2 if not defined).
   */
  private handleSensorCollisions(): void {
    for (let i = 0; i < this.sensors.length; i++) {
      for (let j = i + 1; j < this.sensors.length; j++) {
        const sensor1 = this.sensors[i];
        const sensor2 = this.sensors[j];

        const radius1 = (sensor1 as any).radius || 0.2;
        const radius2 = (sensor2 as any).radius || 0.2;
        const sumRadii = radius1 + radius2;

        const distanceVector = sensor2.position.subtract(sensor1.position);
        const distance = distanceVector.magnitude();

        if (distance > 0 && distance < sumRadii) {
          this.handleCollision(sensor1, sensor2, distanceVector, distance);
        }
      }
    }
  }

  /**
   * Handles collision response between two sensors using a simple elastic collision model.
   * @param sensor1 - The first sensor.
   * @param sensor2 - The second sensor.
   * @param distanceVector - The vector from sensor1 to sensor2.
   * @param distance - The distance between sensor centers.
   */
  private handleCollision(
    sensor1: Sensor,
    sensor2: Sensor,
    distanceVector: Vector3,
    distance: number
  ): void {
    const normal = distanceVector.normalize();
    const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
    const speed = relativeVelocity.dot(normal);
    if (speed >= 0) return; // Sensors are separating.

    const totalMass = sensor1.mass + sensor2.mass;
    const impulse = (2 * speed) / totalMass;

    sensor1.velocity = sensor1.velocity.subtract(
      normal.multiplyScalar(impulse * sensor2.mass)
    );
    sensor2.velocity = sensor2.velocity.add(
      normal.multiplyScalar(impulse * sensor1.mass)
    );

    Logger.debug(
      `Collision handled between sensor ${sensor1.id} and sensor ${sensor2.id}.`,
      'SimulationEngine.handleCollision'
    );
  }

  /**
   * Checks a sensor against the container boundary and applies a reflective collision response if needed.
   * @param sensor - The sensor to check.
   * @param container - The sensor sphere acting as a container.
   */
  private handleContainerCollision(
    sensor: Sensor,
    container: SensorSphere
  ): void {
    const distanceFromCenter = sensor.position.distanceTo(container.center);
    if (distanceFromCenter > container.radius) {
      // Calculate the normal from the container center to the sensor.
      const normal = sensor.position.subtract(container.center).normalize();
      // Reflect sensor velocity: v' = v - 2 * (v ⋅ normal) * normal.
      const dotProd = sensor.velocity.dot(normal);
      const reflectedVelocity = sensor.velocity.subtract(
        normal.multiplyScalar(2 * dotProd)
      );
      sensor.velocity = reflectedVelocity;
      // Reposition sensor onto the container boundary.
      sensor.position = container.center.add(
        normal.multiplyScalar(container.radius)
      );
      Logger.debug(
        `Sensor ${sensor.id} collided with container boundary of ${container.id}.`,
        'SimulationEngine.handleContainerCollision'
      );
    }
  }
}
