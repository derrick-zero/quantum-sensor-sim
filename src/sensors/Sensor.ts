import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';

/**
 * Represents a sensor in the simulation with physical properties and advanced behaviors.
 * The sensor supports features such as:
 * - Standard kinematics (position, velocity, acceleration)
 * - Vibration (local oscillatory motion)
 * - Rotation and wobble (precession)
 * - Black body radiation (energy emission)
 * - Gravitational and other force interactions (to be computed)
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

  // Vibration properties: modify position in a periodic way.
  public vibrationAmplitude: Vector3;
  public vibrationFrequency: Vector3;
  public vibrationPhase: Vector3;

  // Rotation and wobble properties: control sensor orientation dynamics.
  public rotationAxis: Vector3;
  public rotationAngle: number;
  public rotationSpeed: number;
  public wobbleAmplitude: number;
  public wobbleFrequency: number;

  // Radiation properties: model black body energy emission.
  public temperature: number;
  public emissivity: number;
  public radiatedEnergy: number;

  /**
   * Constructs a new Sensor.
   * @param id - Unique sensor identifier.
   * @param position - Initial position (default is origin).
   * @param velocity - Initial velocity (default is zero).
   * @param mass - Sensor's mass; must be > 0.
   * @param charge - Sensor's electrical charge.
   * @param state - Initial sensor state.
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

    // Initialize vibration parameters (defaults to no vibration).
    this.vibrationAmplitude = new Vector3();
    this.vibrationFrequency = new Vector3();
    this.vibrationPhase = new Vector3();

    // Initialize rotation and wobble parameters (defaults to no rotation).
    this.rotationAxis = new Vector3(0, 1, 0); // Default rotation about Y-axis.
    this.rotationAngle = 0;
    this.rotationSpeed = 0;
    this.wobbleAmplitude = 0;
    this.wobbleFrequency = 0;

    // Initialize radiation properties.
    this.temperature = 0; // Temperature (Kelvin); assumed off if zero.
    this.emissivity = Constants.DEFAULT_EMISSIVITY; // Default emissivity.
    this.radiatedEnergy = 0;
  }

  /**
   * Applies the given force to the sensor, updating its acceleration using F = m * a.
   * @param force - The force vector to be applied.
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
   *  - Updates kinematics: velocity and position.
   *  - Applies vibration, rotation, wobble, and radiation computations.
   * @param deltaTime - Time step (seconds); must be > 0.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }

    // Update velocity: v = v0 + a * dt.
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    // Update position: s = s0 + v * dt.
    this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
    // Reset acceleration for next update.
    this.acceleration = new Vector3();

    // Apply additional dynamic behaviors.
    this.updateVibration(deltaTime);
    this.updateRotation(deltaTime);
    this.updateWobble(deltaTime);
    this.calculateRadiation(deltaTime);
  }

  /**
   * Updates sensor position via harmonic vibration.
   * Uses: offset = amplitude * sin(2π * frequency * t + phase)
   * @param deltaTime - Current time step (used as a proxy for time).
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
   * Updates the sensor's rotation based on rotation speed.
   * @param deltaTime - Time step in seconds.
   */
  private updateRotation(deltaTime: number): void {
    this.rotationAngle += this.rotationSpeed * deltaTime;
    this.rotationAngle %= Constants.TWO_PI;
  }

  /**
   * Applies a wobbling effect by perturbing the rotation angle.
   * @param deltaTime - Time step in seconds.
   */
  private updateWobble(deltaTime: number): void {
    const wobbleDelta =
      this.wobbleAmplitude *
      Math.sin(Constants.TWO_PI * this.wobbleFrequency * deltaTime);
    this.rotationAngle = (this.rotationAngle + wobbleDelta) % Constants.TWO_PI;
  }

  /**
   * Calculates the energy radiated during the time step using the Stefan-Boltzmann law.
   * E = emissivity * sigma * A * T^4 * deltaTime
   * Approximates sensor surface area using mass-based density estimates.
   * @param deltaTime - Time step in seconds.
   */
  private calculateRadiation(deltaTime: number): void {
    if (this.temperature <= 0 || this.emissivity <= 0) return;
    // Estimate sensor radius assuming density of ~5510 kg/m³.
    const density = 5510;
    const volume = this.mass / density;
    const radius = Math.cbrt((3 * volume) / (4 * Math.PI));
    const surfaceArea = 4 * Math.PI * radius * radius;
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
   * Calculates and applies external forces (e.g., gravitational) based on other sensors.
   * Currently, this function simply logs that forces would be computed.
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
          // TODO: Compute and apply forces (integrate with GravitySimulator or similar).
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
   * Adds a sensor neighbor for potential local interactions.
   * @param sensor - The neighboring sensor to add.
   */
  public addNeighbor(sensor: Sensor): void {
    if (!sensor)
      throw new Error('Neighbor sensor cannot be null or undefined.');
    this.neighbors.push(sensor);
  }

  /**
   * Removes a neighbor sensor from the local collection.
   * @param sensorId - The unique identifier of the sensor to remove.
   */
  public removeNeighbor(sensorId: string): void {
    this.neighbors = this.neighbors.filter(s => s.id !== sensorId);
  }
}
