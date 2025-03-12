import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';

/**
 * Represents a sensor in the simulation with physical properties and advanced behaviors.
 * Supports standard kinematics, vibration, rotation/wobble, radiation, and force interactions.
 * Additional dynamic properties include:
 * - radius: for collision detection (default 0.2)
 * - spin: angular velocity (radians per second)
 * - color: visual representation based on charge.
 */
export class Sensor {
  public id: string;
  public position: Vector3;
  public velocity: Vector3;
  public acceleration: Vector3;
  public mass: number;
  public charge: number;
  public state: SensorState;
  public neighbors: Sensor[];

  // Vibration properties.
  public vibrationAmplitude: Vector3;
  public vibrationFrequency: Vector3;
  public vibrationPhase: Vector3;

  // Rotation and wobble properties.
  public rotationAxis: Vector3;
  public rotationAngle: number;
  public rotationSpeed: number;
  public wobbleAmplitude: number;
  public wobbleFrequency: number;

  // Radiation properties.
  public temperature: number;
  public emissivity: number;
  public radiatedEnergy: number;

  // Extra dynamic properties.
  public radius: number; // For collision detection
  public spin: number; // Angular velocity (radians per second)
  public color: string; // Visual representation

  /**
   * Constructs a new Sensor.
   * @param id - Unique sensor identifier.
   * @param position - Initial position (default: origin).
   * @param velocity - Initial velocity (default: zero).
   * @param mass - Sensor's mass; must be > 0 (default from Constants).
   * @param charge - Sensor's electrical charge (default from Constants).
   * @param state - Initial sensor state (default is ACTIVE).
   */
  constructor(
    id: string,
    position: Vector3 = new Vector3(),
    velocity: Vector3 = new Vector3(),
    mass: number = Constants.DEFAULT_SENSOR_MASS,
    charge: number = Constants.DEFAULT_SENSOR_CHARGE,
    state: SensorState = SensorState.ACTIVE
  ) {
    if (mass <= 0) {
      throw new Error('Mass must be greater than zero.');
    }
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector3();
    this.mass = mass;
    this.charge = charge;
    this.state = state;
    this.neighbors = [];

    // Initialize vibration properties (no vibration by default).
    this.vibrationAmplitude = new Vector3();
    this.vibrationFrequency = new Vector3();
    this.vibrationPhase = new Vector3();

    // Initialize rotation and wobble properties.
    this.rotationAxis = new Vector3(0, 1, 0); // Default rotation about Y-axis.
    this.rotationAngle = 0;
    this.rotationSpeed = 0;
    this.wobbleAmplitude = 0;
    this.wobbleFrequency = 0;

    // Initialize radiation properties.
    this.temperature = 0; // Kelvin; non-radiative if zero.
    this.emissivity = Constants.DEFAULT_EMISSIVITY;
    this.radiatedEnergy = 0;

    // Initialize extra dynamic properties.
    this.radius = Constants.DEFAULT_SENSOR_RADIUS; // Default collision radius from constants.
    this.spin = 0; // No spin by default.
    // Compute and assign color based on charge.
    this.color = this.computeColor(charge);
  }

  /**
   * Computes the sensor's display color based on its charge.
   * - Neutral sensors (charge === 0) are given a neutral gray ("#888888").
   * - Positive sensors are assigned red ("#FF0000").
   * - Negative sensors are assigned cyan ("#00FFFF").
   *
   * Future improvements may include more sophisticated mappings.
   * @param charge - The sensor's charge.
   * @returns A color string.
   */
  private computeColor(charge: number): string {
    // Simple case: if charge is 0, return a neutral color.
    if (charge === 0) return '#888888';
    // For now, use our current logic. Later, incorporate temperature-based adjustments.
    return charge > 0 ? '#FF0000' : '#00FFFF';
  }

  /**
   * Applies the given force to the sensor, updating acceleration via F = m*a.
   * @param force - The force vector to apply.
   */
  public applyForce(force: Vector3): void {
    if (!force) {
      throw new Error('Force vector cannot be null or undefined.');
    }
    const deltaAcceleration = force.multiplyScalar(1 / this.mass);
    this.acceleration = this.acceleration.add(deltaAcceleration);
  }

  /**
   * Updates the sensor's state over the given time step:
   * - Updates velocity: v = v0 + a * dt.
   * - Updates position: s = s0 + v * dt.
   * - Applies additional dynamic behaviors (vibration, rotation, wobble, radiation).
   * @param deltaTime - Time step (s); must be > 0.
   * @throws Error if deltaTime <= 0.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
    this.acceleration = new Vector3();

    this.updateVibration(deltaTime);
    this.updateRotation(deltaTime);
    this.updateWobble(deltaTime);
    this.calculateRadiation(deltaTime);
  }

  /**
   * Updates the sensor's position based on harmonic vibration.
   * @param deltaTime - Time step.
   */
  private updateVibration(deltaTime: number): void {
    const offsetX =
      this.vibrationAmplitude.x *
      Math.sin(
        Constants.TWO_PI * this.vibrationFrequency.x * deltaTime +
          this.vibrationPhase.x
      );
    const offsetY =
      this.vibrationAmplitude.y *
      Math.sin(
        Constants.TWO_PI * this.vibrationFrequency.y * deltaTime +
          this.vibrationPhase.y
      );
    const offsetZ =
      this.vibrationAmplitude.z *
      Math.sin(
        Constants.TWO_PI * this.vibrationFrequency.z * deltaTime +
          this.vibrationPhase.z
      );
    this.position = this.position.add(new Vector3(offsetX, offsetY, offsetZ));
  }

  /**
   * Updates the sensor's rotation angle based on its rotation speed.
   * @param deltaTime - Time step (s).
   */
  private updateRotation(deltaTime: number): void {
    this.rotationAngle += this.rotationSpeed * deltaTime;
    this.rotationAngle %= Constants.TWO_PI;
  }

  /**
   * Applies a wobbling effect by perturbing the rotation angle.
   * @param deltaTime - Time step (s).
   */
  private updateWobble(deltaTime: number): void {
    const wobbleDelta =
      this.wobbleAmplitude *
      Math.sin(Constants.TWO_PI * this.wobbleFrequency * deltaTime);
    this.rotationAngle = (this.rotationAngle + wobbleDelta) % Constants.TWO_PI;
  }

  /**
   * Calculates energy radiated during the time step using the Stefan-Boltzmann law.
   * Approximates sensor surface area based on a mass-determined density.
   * @param deltaTime - Time step (s).
   */
  private calculateRadiation(deltaTime: number): void {
    if (this.temperature <= 0 || this.emissivity <= 0) return;
    const density = 5510; // Approximate density (kg/m³)
    const volume = this.mass / density;
    const estimatedRadius = Math.cbrt((3 * volume) / (4 * Math.PI));
    const surfaceArea = 4 * Math.PI * estimatedRadius * estimatedRadius;
    const sigma = Constants.STEFAN_BOLTZMANN_CONSTANT;
    const energyReleased =
      this.emissivity *
      sigma *
      surfaceArea *
      Math.pow(this.temperature, 4) *
      deltaTime;
    this.radiatedEnergy += energyReleased;
  }

  /**
   * Placeholder to compute external forces based on neighboring sensors.
   * @param sensors - Array of neighboring sensors.
   */
  public calculateForces(sensors: Sensor[]): void {
    if (!sensors || sensors.length === 0) return;
    sensors.forEach(other => {
      if (other.id !== this.id) {
        try {
          Logger.debug(
            `Computing force between sensor ${this.id} and ${other.id}`,
            'Sensor.calculateForces'
          );
          // Force calculation placeholder.
        } catch (error) {
          Logger.error(
            `Error calculating force: ${(error as Error).message}`,
            'Sensor.calculateForces'
          );
        }
      }
    });
  }

  /**
   * Sets the sensor's state.
   * @param state - The new sensor state.
   */
  public setState(state: SensorState): void {
    if (!state) throw new Error('State cannot be null or undefined.');
    this.state = state;
  }

  /**
   * Adds a neighbor sensor for local interactions.
   * @param sensor - The neighbor sensor to add.
   */
  public addNeighbor(sensor: Sensor): void {
    if (!sensor)
      throw new Error('Neighbor sensor cannot be null or undefined.');
    this.neighbors.push(sensor);
  }

  /**
   * Removes a neighbor sensor by its ID.
   * @param sensorId - The ID of the sensor to remove.
   */
  public removeNeighbor(sensorId: string): void {
    this.neighbors = this.neighbors.filter(s => s.id !== sensorId);
  }
}
