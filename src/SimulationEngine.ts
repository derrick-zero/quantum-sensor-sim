import { Sensor } from './sensors/Sensor';
import { SensorSphere } from './sensors/SensorSphere';
import { Logger } from './core/Logger';
import { Constants } from './core/Constants';
import { Vector3 } from './core/Vector3';

/**
 * SimulationEngine orchestrates the simulation by updating sensors and sensor spheres,
 * processing physics interactions, handling collisions, and enforcing container boundaries.
 * It supports starting, pausing, resetting, randomizing, and toggling time reversal.
 */
export class SimulationEngine {
  private sensors: Sensor[];
  private sensorSpheres: SensorSphere[];
  public deltaTime: number; // Time step in seconds.
  public globalTime: number;
  private running: boolean;
  private timeReversed: boolean;
  public resetAndRestart: boolean = true;

  private initialSensorsState: Sensor[];
  private initialSensorSpheresState: SensorSphere[];
  private loopTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Designated container: we'll use the first sensor sphere if available.
  public container: SensorSphere | null;

  /**
   * Constructs a new SimulationEngine.
   * @param sensors - Array of sensors in the simulation.
   * @param sensorSpheres - Array of sensor spheres.
   * @param deltaTime - Time step for updates in seconds (must be > 0).
   * @throws Error if deltaTime is not greater than zero.
   */
  constructor(
    sensors: Sensor[] = [],
    sensorSpheres: SensorSphere[] = [],
    deltaTime: number = Constants.DEFAULT_TIME_STEP
  ) {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    this.sensors = sensors;
    this.sensorSpheres = sensorSpheres;
    this.deltaTime = deltaTime;
    this.globalTime = 0;
    this.running = false;
    this.timeReversed = false;
    this.container = sensorSpheres.length > 0 ? sensorSpheres[0] : null;

    // Save initial state snapshots for reset functionality.
    this.initialSensorsState = sensors.map(s => this.cloneSensor(s));
    this.initialSensorSpheresState = sensorSpheres.map(ss =>
      this.cloneSensorSphere(ss)
    );
  }

  private cloneSensor(sensor: Sensor): Sensor {
    return new Sensor(
      sensor.id,
      sensor.position.clone(),
      sensor.velocity.clone(),
      sensor.mass,
      sensor.charge,
      sensor.state
    );
  }

  private cloneSensorSphere(sphere: SensorSphere): SensorSphere {
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
    if (this.loopTimeoutId) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
    Logger.info('Pausing simulation engine.', 'SimulationEngine.pause');
  }

  /**
   * Toggles time reversal. Inverts velocities of sensors and sensor spheres so that the simulation visually rewinds.
   */
  public toggleTimeReversal(): void {
    this.timeReversed = !this.timeReversed;
    this.sensors.forEach(sensor => {
      sensor.velocity = sensor.velocity.multiplyScalar(-1);
    });
    this.sensorSpheres.forEach(sphere => {
      sphere.velocity = sphere.velocity.multiplyScalar(-1);
    });
    Logger.info(
      `Time reversal toggled. Now ${
        this.timeReversed ? 'reversed' : 'forward'
      }.`,
      'SimulationEngine.toggleTimeReversal'
    );
  }

  /**
   * Resets the simulation engine to its initial state and automatically restarts the simulation (if enabled).
   * Global time is reset to zero, and sensors & sensor spheres are re-cloned from the initial snapshots.
   * After resetting, if resetAndRestart is true, the simulation loop is restarted after a short delay.
   */
  public reset(): void {
    // Stop the simulation loop first.
    this.pause();

    // Reset global time.
    this.globalTime = 0;

    // Re-clone sensors and sensor spheres from their initial snapshots.
    this.sensors = this.initialSensorsState.map(s => this.cloneSensor(s));
    this.sensorSpheres = this.initialSensorSpheresState.map(ss =>
      this.cloneSensorSphere(ss)
    );

    // Re-establish the container.
    this.container =
      this.sensorSpheres.length > 0 ? this.sensorSpheres[0] : null;

    if (this.resetAndRestart) {
      // Immediately mark the simulation as running.
      this.running = true;
      // Schedule the simulation loop to resume on the next tick.
      setTimeout(() => {
        this.loop();
      }, 0);
      Logger.info(
        'Simulation has been reset and restarted.',
        'SimulationEngine.reset'
      );
    } else {
      this.running = false;
      Logger.info(
        'Simulation has been reset and stopped.',
        'SimulationEngine.reset'
      );
    }
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
   * Updates the simulation by one time step.
   * Global time is updated based on time reversal mode.
   * Sensors and sensor spheres are updated, collision handling is processed, and container boundaries enforced.
   * @throws Error if deltaTime <= 0.
   */
  public update(): void {
    if (!this.running) return;
    if (this.deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }

    // Determine effective time step based on time reversal.
    const step = this.timeReversed ? -this.deltaTime : this.deltaTime;
    this.globalTime += step;
    const dt = Math.abs(step);

    // Update sensor spheres and sensors.
    this.sensorSpheres.forEach(sphere => sphere.update(dt));
    this.sensors.forEach(sensor => sensor.update(dt));

    // Handle collisions and sensor-sphere interactions.
    this.handleSensorCollisions();

    for (let i = 0; i < this.sensorSpheres.length; i++) {
      for (let j = i + 1; j < this.sensorSpheres.length; j++) {
        this.sensorSpheres[i].calculateForces([this.sensorSpheres[j]]);
        this.sensorSpheres[j].calculateForces([this.sensorSpheres[i]]);
      }
    }

    // Enforce container boundaries if a container is defined.
    if (this.container !== null) {
      const containerSphere: SensorSphere = this.container;
      this.sensors.forEach(sensor => {
        this.handleContainerCollision(sensor, containerSphere);
      });
    }
    Logger.debug(
      `Simulation time: ${this.globalTime.toFixed(3)} s`,
      'SimulationEngine.update'
    );
  }

  /**
   * The main simulation loop. For smoother visuals, consider replacing setTimeout with requestAnimationFrame.
   */
  private loop(): void {
    if (!this.running) return;
    this.update();
    this.loopTimeoutId = setTimeout(() => this.loop(), this.deltaTime * 1000);
    // In Node, unref() prevents this timer from keeping the process alive.
    if (
      this.loopTimeoutId &&
      typeof (this.loopTimeoutId as any).unref === 'function'
    ) {
      (this.loopTimeoutId as any).unref();
    }
  }

  /**
   * Adds a sensor to the simulation.
   * @param sensor - The sensor to add.
   * @throws Error if sensor is null or undefined.
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
   * @throws Error if sphere is null or undefined.
   */
  public addSensorSphere(sphere: SensorSphere): void {
    if (!sphere) {
      throw new Error('SensorSphere cannot be null or undefined.');
    }
    this.sensorSpheres.push(sphere);
  }

  /**
   * Handles collisions among individual sensors using a simple elastic collision model.
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
   * Checks a sensor against the container boundary and applies a reflective collision response.
   * @param sensor - The sensor to check.
   * @param container - The sensor sphere acting as a container.
   */
  private handleContainerCollision(
    sensor: Sensor,
    container: SensorSphere
  ): void {
    const distanceFromCenter = sensor.position.distanceTo(container.center);
    if (distanceFromCenter > container.radius) {
      const normal = sensor.position.subtract(container.center).normalize();
      const dotProd = sensor.velocity.dot(normal);
      sensor.velocity = sensor.velocity.subtract(
        normal.multiplyScalar(2 * dotProd)
      );
      sensor.position = container.center.add(
        normal.multiplyScalar(container.radius)
      );
      Logger.debug(
        `Sensor ${sensor.id} collided with container boundary of sphere ${container.id}.`,
        'SimulationEngine.handleContainerCollision'
      );
    }
  }

  /**
   * Handles collision response between two sensors using an impulse-based elastic collision model.
   *
   * **Conservation Principles:**
   * - **Momentum Conservation:**
   *   The impulse is computed so that the total momentum is preserved:
   *     m₁·v₁ + m₂·v₂ = m₁·v₁' + m₂·v₂'
   *
   * - **Kinetic Energy Conservation:**
   *   For a perfectly elastic collision, kinetic energy is conserved:
   *     ½·m₁·v₁² + ½·m₂·v₂² = ½·m₁·v₁'² + ½·m₂·v₂'²
   *
   * **Performance Considerations:**
   * This impulse-based method calculates the post-collision velocities in one step using the impulse formula,
   * which is computationally efficient compared to iterative “brute-force” methods that adjust velocities incrementally
   * until the conservation conditions are met. This one-pass approach is especially beneficial under high collision frequencies.
   *
   * @param sensor1 - The first sensor involved in the collision.
   * @param sensor2 - The second sensor involved in the collision.
   * @param distanceVector - The vector from sensor1 to sensor2.
   * @param _distance - The distance between the centers of the two sensors.
   *
   * @remarks
   * This method assumes perfectly elastic collisions. Any introduction of inelastic factors (energy loss, damping, etc.)
   * would require modifying the impulse calculation accordingly.
   */
  private handleCollision(
    sensor1: Sensor,
    sensor2: Sensor,
    distanceVector: Vector3,
    _distance: number
  ): void {
    const normal = distanceVector.normalize();
    const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
    const speed = relativeVelocity.dot(normal);

    // If the sensors are separating, no need to record an event.
    if (speed >= 0) return;

    const totalMass = sensor1.mass + sensor2.mass;
    const impulse = (2 * speed) / totalMass;

    // Calculate pre-collision metrics
    const preMomentum = sensor1.velocity
      .multiplyScalar(sensor1.mass)
      .add(sensor2.velocity.multiplyScalar(sensor2.mass))
      .magnitude();
    const preEnergy =
      0.5 * sensor1.mass * sensor1.velocity.magnitude() ** 2 +
      0.5 * sensor2.mass * sensor2.velocity.magnitude() ** 2;

    // Update sensor velocities (impulse-based calculation)
    sensor1.velocity = sensor1.velocity.subtract(
      normal.multiplyScalar(impulse * sensor2.mass)
    );
    sensor2.velocity = sensor2.velocity.add(
      normal.multiplyScalar(impulse * sensor1.mass)
    );

    // Calculate post-collision metrics
    const postMomentum = sensor1.velocity
      .multiplyScalar(sensor1.mass)
      .add(sensor2.velocity.multiplyScalar(sensor2.mass))
      .magnitude();
    const postEnergy =
      0.5 * sensor1.mass * sensor1.velocity.magnitude() ** 2 +
      0.5 * sensor2.mass * sensor2.velocity.magnitude() ** 2;

    // Log debug info (existing functionality)
    Logger.debug(
      `Collision handled between sensor ${sensor1.id} and sensor ${sensor2.id}.`,
      'SimulationEngine.handleCollision'
    );

    // Record the collision event.
    Logger.recordEvent({
      timestamp: Date.now(),
      event: 'collision',
      sensorIds: [sensor1.id, sensor2.id],
      preMomentum,
      postMomentum,
      preEnergy,
      postEnergy,
    });
  }
}
