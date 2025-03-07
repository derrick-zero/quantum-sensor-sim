import { Sensor } from './Sensor';
import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Logger } from '../core/Logger';
import { Constants } from '../core/Constants';

/**
 * Represents a sphere composed of sensors, which can act as a single entity or a collection.
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
    this.velocity = new Vector3();
    this.acceleration = new Vector3();
    this.state = state;

    this.initializeSensors(sensorCount);
    this.computeMass();
  }

  /**
   * Initializes sensors within the sphere, distributing them based on spherical coordinates.
   * @param sensorCount - The number of sensors to initialize.
   */
  private initializeSensors(sensorCount: number): void {
    for (let i = 0; i < sensorCount; i++) {
      // Generate spherical coordinates.
      const theta = Math.acos(2 * Math.random() - 1); // Polar angle [0, π]
      const phi = Constants.TWO_PI * Math.random(); // Azimuthal angle [0, 2π]
      const r = this.radius * Math.cbrt(Math.random()); // Uniform distribution within the sphere

      // Convert spherical to Cartesian coordinates.
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      const position = this.center.add(new Vector3(x, y, z));
      const sensorId = `${this.id}_sensor_${i + 1}`;
      const sensor = new Sensor(sensorId, position);
      this.sensors.push(sensor);
    }
  }

  /**
   * Computes the total mass of the sphere based on its sensors.
   */
  public computeMass(): void {
    this.mass = this.sensors.reduce(
      (totalMass, sensor) => totalMass + sensor.mass,
      0
    );
  }

  /**
   * Updates the sphere's velocity, center, and each sensor's position using the sphere's velocity,
   * and calls each sensor's update method. Also resets acceleration.
   * @param deltaTime - The time step for the simulation update.
   * @throws Error if deltaTime is less than or equal to zero.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }

    // Update the sphere's velocity and center based on its acceleration.
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    this.center = this.center.add(this.velocity.multiplyScalar(deltaTime));
    this.acceleration = new Vector3(); // Reset acceleration.

    // Update each sensor's position relative to the sphere's movement and its own dynamics.
    for (const sensor of this.sensors) {
      sensor.position = sensor.position.add(
        this.velocity.multiplyScalar(deltaTime)
      );
      sensor.update(deltaTime);
    }
  }

  /**
   * Calculates the net force acting on this sphere due to other spheres and updates acceleration.
   * @param spheres - An array of other sensor spheres.
   */
  public calculateForces(spheres: SensorSphere[]): void {
    let netForce = new Vector3();

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
   * Adds a sensor to the sphere and recomputes the total mass.
   * @param sensor - The sensor to add.
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
   * Removes a sensor from the sphere by its ID and recomputes the total mass.
   * @param sensorId - The ID of the sensor to remove.
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
   * Updates the state of the sphere and optionally propagates it to all sensors.
   * @param state - The new state to set.
   * @param propagateToSensors - If true, updates state for all sensors.
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
   * Rotates the sphere (and its sensors) around a given axis by a specified angle.
   * @param axis - The axis to rotate around.
   * @param angle - The rotation angle in radians.
   * @throws Error if axis or angle is invalid.
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
  }

  /**
   * Applies vibration effects to all sensors in the sphere.
   * @param amplitude - The vibration amplitude as a Vector3.
   * @param frequency - The vibration frequency as a Vector3.
   * @param deltaTime - The time step for computing the vibration offset.
   * @throws Error if amplitude, frequency, or deltaTime is invalid.
   */
  public vibrate(
    amplitude: Vector3,
    frequency: Vector3,
    deltaTime: number
  ): void {
    if (!amplitude || !frequency || deltaTime <= 0) {
      throw new Error('Amplitude, frequency, and deltaTime must be valid.');
    }
    const time = deltaTime;
    for (const sensor of this.sensors) {
      const vibrationOffset = new Vector3(
        amplitude.x * Math.sin(Constants.TWO_PI * frequency.x * time),
        amplitude.y * Math.sin(Constants.TWO_PI * frequency.y * time),
        amplitude.z * Math.sin(Constants.TWO_PI * frequency.z * time)
      );
      sensor.position = sensor.position.add(vibrationOffset);
    }
  }

  /**
   * Calculates interactions among sensors in the sphere.
   * Currently, this method logs a debug message as a placeholder.
   */
  public calculateInteractions(): void {
    Logger.debug(
      `Calculating interactions among ${this.sensors.length} sensors in sphere ${this.id}.`,
      'SensorSphere.calculateInteractions'
    );
    // Placeholder for future implementation.
  }

  /**
   * Applies an impulse force to the sensor sphere, modifying its velocity.
   * The impulse is applied as Δv = impulse / mass.
   * @param force - The impulse force vector.
   * @throws Error if mass is zero.
   */
  public applyImpulse(force: Vector3): void {
    if (this.mass === 0) {
      throw new Error('Cannot apply impulse: sphere mass is zero.');
    }
    // Apply impulse: Δv = force / mass.
    this.velocity = this.velocity.add(force.multiplyScalar(1 / this.mass));
    Logger.debug(
      `Impulse applied to sphere ${this.id}: ${force.toString()}`,
      'SensorSphere.applyImpulse'
    );
  }
}
