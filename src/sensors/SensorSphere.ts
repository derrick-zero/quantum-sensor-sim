import { Sensor } from './Sensor';
import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Logger } from '../core/Logger';
import { Constants } from '../core/Constants';

/**
 * Represents a sphere composed of sensors, which can act as a single entity or a container.
 * Manages sensor initialization, kinematics, mass computation, collision force calculations,
 * rotation, vibration effects, state propagation, impulse application, and visual representation.
 */
export class SensorSphere {
  public id: string;
  public sensors: Sensor[];
  public center: Vector3;
  public radius: number;
  public mass: number;
  public velocity: Vector3;
  public acceleration: Vector3;
  public state: SensorState;
  public color: string; // New: overall sphere color based on average sensor charge.

  /**
   * Creates a new SensorSphere instance.
   * @param id - Unique identifier for the sensor sphere.
   * @param center - Central position of the sphere.
   * @param radius - Radius of the sphere.
   * @param sensorCount - Number of sensors to initialize within the sphere.
   * @param state - Initial state of the sphere.
   */
  constructor(
    id: string,
    center: Vector3 = new Vector3(),
    radius: number = 1.0,
    sensorCount: number = 100,
    state: SensorState = SensorState.ACTIVE
  ) {
    this.id = id;
    this.center = center;
    this.radius = radius;
    this.sensors = [];
    this.mass = 0;
    this.velocity = Vector3.zero();
    this.acceleration = Vector3.zero();
    this.state = state;

    this.initializeSensors(sensorCount);
    this.computeMass();
    // Compute and assign the sphere's color based on the average sensor charge.
    const avgCharge = this.computeAverageCharge();
    this.color = this.computeColor(avgCharge);
  }

  /**
   * Initializes sensors within the sphere using a uniform spherical distribution.
   * Each sensor is given a charge with roughly a 1/3 chance of being neutral (0),
   * positive (5), or negative (-5).
   * @param sensorCount - The number of sensors to create.
   */
  private initializeSensors(sensorCount: number): void {
    for (let i = 0; i < sensorCount; i++) {
      // Generate spherical coordinates.
      const theta = Math.acos(2 * Math.random() - 1); // angle from z-axis [0, π]
      const phi = Constants.TWO_PI * Math.random(); // angle in x-y plane [0, 2π]
      const r = this.radius * Math.cbrt(Math.random()); // uniform distribution in volume

      // Convert spherical coordinates to Cartesian.
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      const position = this.center.add(new Vector3(x, y, z));
      const sensorId = `${this.id}_sensor_${i + 1}`;

      // Randomly pick a charge: ~1/3 chance for 0, +5, and -5.
      let charge: number;
      const rnd = Math.random();
      if (rnd < 1 / 3) {
        charge = 0; // neutral
      } else if (rnd < 2 / 3) {
        charge = 5; // positive charge
      } else {
        charge = -5; // negative charge
      }

      // Create the sensor with our chosen charge.
      const sensor = new Sensor(
        sensorId,
        position,
        Vector3.zero(),
        Constants.DEFAULT_SENSOR_MASS,
        charge,
        SensorState.ACTIVE
      );
      this.sensors.push(sensor);
    }
  }

  /**
   * Computes and updates the total mass of the sensor sphere based on its sensors.
   */
  public computeMass(): void {
    this.mass = this.sensors.reduce(
      (totalMass, sensor) => totalMass + sensor.mass,
      0
    );
  }

  /**
   * Computes the average sensor charge for the sensors contained within the sphere.
   * @returns The average charge (0 if there are no sensors).
   */
  private computeAverageCharge(): number {
    if (this.sensors.length === 0) return 0;
    const totalCharge = this.sensors.reduce(
      (sum, sensor) => sum + sensor.charge,
      0
    );
    return totalCharge / this.sensors.length;
  }

  /**
   * Computes the sphere's color based on the average sensor charge.
   * Uses the same continuous HSL interpolation logic as Sensor.computeColor():
   * - For an average charge of 0, returns "#FFFFFF".
   * - For positive average charge, maps normalized charge from 30° to 0°.
   * - For negative average charge, maps normalized charge from 180° to 240°.
   * @param charge - The average charge.
   * @returns A CSS HSL color string.
   */
  private computeColor(charge: number): string {
    if (charge === 0) return '#FFFFFF';
    const maxCharge = Constants.MAX_SENSOR_CHARGE;
    const normalizedCharge = Math.min(Math.abs(charge) / maxCharge, 1);
    let hue: number;
    if (charge > 0) {
      hue = 30 - 30 * normalizedCharge;
    } else {
      hue = 180 + 60 * normalizedCharge;
    }
    return `hsl(${Math.round(hue)}, 100%, 50%)`;
  }

  /**
   * Updates the sphere's kinematics (velocity, center) and each sensor's state.
   * Then, recomputes the sphere's color based on the updated average sensor charge.
   * @param deltaTime - Time step in seconds; must be > 0.
   * @throws Error if deltaTime <= 0.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }

    // Update sphere's velocity and center.
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    this.center = this.center.add(this.velocity.multiplyScalar(deltaTime));
    this.acceleration = Vector3.zero();

    // Update each sensor.
    for (const sensor of this.sensors) {
      sensor.position = sensor.position.add(
        this.velocity.multiplyScalar(deltaTime)
      );
      sensor.update(deltaTime);
    }

    // Recompute mass in case sensors changed.
    this.computeMass();

    // Recalculate and update sphere's color based on average sensor charge.
    const avgCharge = this.computeAverageCharge();
    this.color = this.computeColor(avgCharge);
  }

  /**
   * Calculates forces due to other sensor spheres and updates acceleration.
   * @param spheres - Array of other sensor spheres.
   */
  public calculateForces(spheres: SensorSphere[]): void {
    let netForce = Vector3.zero();
    for (const otherSphere of spheres) {
      if (otherSphere.id !== this.id) {
        const distanceVector = otherSphere.center.subtract(this.center);
        const distance = distanceVector.magnitude();
        if (distance > 0) {
          const G = Constants.GRAVITATIONAL_CONSTANT;
          const forceMagnitude =
            (G * this.mass * otherSphere.mass) / (distance * distance);
          const forceDirection = distanceVector.normalize();
          const gravitationalForce =
            forceDirection.multiplyScalar(forceMagnitude);
          netForce = netForce.add(gravitationalForce);
        }
      }
    }
    this.acceleration = this.acceleration.add(
      netForce.multiplyScalar(1 / this.mass)
    );
  }

  /**
   * Adds a sensor to the sphere and recomputes the mass.
   * @param sensor - The sensor to add.
   * @throws Error if sensor is null or undefined.
   */
  public addSensor(sensor: Sensor): void {
    if (!sensor) {
      throw new Error('Sensor cannot be null or undefined.');
    }
    this.sensors.push(sensor);
    this.computeMass();
    Logger.info(
      `Added sensor ${sensor.id} to sphere ${this.id}.`,
      'SensorSphere.addSensor'
    );
  }

  /**
   * Removes a sensor from the sphere by its ID and recomputes the mass.
   * @param sensorId - The sensor's ID to remove.
   */
  public removeSensor(sensorId: string): void {
    this.sensors = this.sensors.filter(sensor => sensor.id !== sensorId);
    this.computeMass();
    Logger.info(
      `Removed sensor ${sensorId} from sphere ${this.id}.`,
      'SensorSphere.removeSensor'
    );
  }

  /**
   * Sets the state of the sphere and optionally propagates it to its sensors.
   * @param state - The new state.
   * @param propagateToSensors - If true, updates the state for all sensors. Defaults to true.
   */
  public setState(
    state: SensorState,
    propagateToSensors: boolean = true
  ): void {
    this.state = state;
    if (propagateToSensors) {
      for (const sensor of this.sensors) {
        sensor.setState(state);
      }
    }
  }

  /**
   * Rotates the sphere by rotating each sensor's position around the sphere's center.
   * @param axis - The axis to rotate around.
   * @param angle - The rotation angle in radians.
   * @throws Error if axis or angle is not provided.
   */
  public rotate(axis: Vector3, angle: number): void {
    if (!axis || angle === undefined) {
      throw new Error('Axis and angle must be provided.');
    }
    for (const sensor of this.sensors) {
      const relativePosition = sensor.position.subtract(this.center);
      const rotatedPosition = relativePosition.rotateAroundAxis(axis, angle);
      sensor.position = this.center.add(rotatedPosition);
    }
    Logger.debug(
      `SensorSphere ${this.id} rotated by ${angle} radians.`,
      'SensorSphere.rotate'
    );
  }

  /**
   * Applies a vibration effect to all sensors in the sphere.
   * @param amplitude - The vibration amplitude as a Vector3.
   * @param frequency - The vibration frequency as a Vector3.
   * @param deltaTime - The time step (s); must be > 0.
   * @throws Error if parameters are invalid.
   */
  public vibrate(
    amplitude: Vector3,
    frequency: Vector3,
    deltaTime: number
  ): void {
    if (!amplitude || !frequency || deltaTime <= 0) {
      throw new Error('Amplitude, frequency, and deltaTime must be valid.');
    }
    for (const sensor of this.sensors) {
      const vibrationOffset = new Vector3(
        amplitude.x * Math.sin(Constants.TWO_PI * frequency.x * deltaTime),
        amplitude.y * Math.sin(Constants.TWO_PI * frequency.y * deltaTime),
        amplitude.z * Math.sin(Constants.TWO_PI * frequency.z * deltaTime)
      );
      sensor.position = sensor.position.add(vibrationOffset);
    }
  }

  /**
   * Calculates and logs interactions between sensors in the sphere.
   * Placeholder for future expansion.
   */
  public calculateInteractions(): void {
    Logger.debug(
      `Calculating interactions among ${this.sensors.length} sensors in sphere ${this.id}.`,
      'SensorSphere.calculateInteractions'
    );
  }

  /**
   * Applies an impulse force to the sensor sphere, updating its velocity.
   * Δv = impulse / mass.
   * @param force - The impulse force vector.
   * @throws Error if sphere mass is zero.
   */
  public applyImpulse(force: Vector3): void {
    if (this.mass === 0) {
      throw new Error('Cannot apply impulse: sphere mass is zero.');
    }
    this.velocity = this.velocity.add(force.multiplyScalar(1 / this.mass));
    Logger.debug(
      `Impulse applied to sphere ${this.id}: ${force.toString()}`,
      'SensorSphere.applyImpulse'
    );
  }

  /**
   * Generates a random point inside a sphere defined by its center and radius.
   * @param center - The center of the sphere.
   * @param radius - The radius of the sphere.
   * @returns A Vector3 representing a random point within the sphere.
   */
  static randomPointInSphere(center: Vector3, radius: number): Vector3 {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Constants.TWO_PI * Math.random();
    const r = radius * Math.cbrt(Math.random());
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);
    return new Vector3(center.x + x, center.y + y, center.z + z);
  }
}
