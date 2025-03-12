import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';

/**
 * Represents an individual sensor used within the simulation.
 * Each sensor has physical properties (position, velocity, acceleration, mass, charge),
 * a state, a visual color determined by its charge, and additional dynamic attributes
 * such as vibration, rotation/wobble, and radiation that can be expanded over time.
 */
export class Sensor {
  public id: string;
  public position: Vector3;
  public velocity: Vector3;
  public acceleration: Vector3;
  public mass: number;
  public charge: number;
  public state: SensorState;
  public color: string;
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
  public radius: number; // For collision detection.
  public spin: number; // Angular velocity (radians per second).

  /**
   * Constructs a new Sensor instance.
   * @param id - A unique identifier for the sensor.
   * @param position - The initial position (default is origin).
   * @param velocity - The initial velocity (default: zero vector).
   * @param mass - The sensor's mass (must be > 0; default taken from Constants).
   * @param charge - The sensor's electrical charge (default taken from Constants).
   * @param state - The initial sensor state (default: ACTIVE).
   */
  constructor(
    id: string,
    position: Vector3 = new Vector3(),
    velocity: Vector3 = Vector3.zero(),
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
    this.acceleration = Vector3.zero();
    this.mass = mass;
    this.charge = charge;
    this.state = state;
    this.neighbors = [];

    // Initialize vibration properties.
    this.vibrationAmplitude = Vector3.zero();
    this.vibrationFrequency = Vector3.zero();
    this.vibrationPhase = Vector3.zero();

    // Initialize rotation and wobble properties.
    this.rotationAxis = new Vector3(0, 1, 0); // Default: rotate around Y-axis.
    this.rotationAngle = 0;
    this.rotationSpeed = 0;
    this.wobbleAmplitude = 0;
    this.wobbleFrequency = 0;

    // Initialize radiation properties.
    this.temperature = 0; // If temperature is zero, sensor is non-radiative.
    this.emissivity = Constants.DEFAULT_EMISSIVITY;
    this.radiatedEnergy = 0;

    // Initialize extra dynamic properties.
    this.radius = Constants.DEFAULT_SENSOR_RADIUS;
    this.spin = 0;

    // Calculate and assign the sensor's initial color based on its charge.
    this.color = this.computeColor(this.charge);
  }

  /**
   * Computes the sensor's display color based on its electrical charge.
   * - Neutral sensors (charge === 0) return NEUTRAL_COLOR.
   * - Positive sensors choose a color randomly from POSITIVE_COLOR_PALETTE.
   * - Negative sensors choose a color randomly from NEGATIVE_COLOR_PALETTE.
   * @param charge - The sensor's electrical charge.
   * @returns A hexadecimal color string.
   */
  private computeColor(charge: number): string {
    if (charge === 0) return Constants.NEUTRAL_COLOR;
    const palette =
      charge > 0
        ? Constants.POSITIVE_COLOR_PALETTE
        : Constants.NEGATIVE_COLOR_PALETTE;
    const index = Math.floor(Math.random() * palette.length);
    return palette[index];
  }

  /**
   * Applies a force vector to the sensor, updating its acceleration.
   * F = m * a.
   * @param force - The force vector to apply.
   */
  public applyForce(force: Vector3): void {
    const accelerationDelta = force.divideScalar(this.mass);
    this.acceleration = this.acceleration.add(accelerationDelta);
  }

  /**
   * Updates the sensor's state over a given time step.
   * Updates velocity and position, then resets acceleration.
   * Calls helper methods to update vibration, rotation, wobble, and radiation.
   * @param deltaTime - The time step in seconds (must be > 0).
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    // Update velocity and position based on current acceleration.
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
    this.acceleration = Vector3.zero();

    // Update dynamic behaviors.
    this.updateVibration(deltaTime);
    this.updateRotation(deltaTime);
    this.updateWobble(deltaTime);
    this.calculateRadiation(deltaTime);
  }

  /**
   * Updates the sensor's position based on vibration.
   * @param deltaTime - The time step.
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
   * @param deltaTime - The time step in seconds.
   */
  private updateRotation(deltaTime: number): void {
    this.rotationAngle += this.rotationSpeed * deltaTime;
    this.rotationAngle %= Constants.TWO_PI;
  }

  /**
   * Applies a wobble effect by perturbing the rotation angle.
   * @param deltaTime - The time step in seconds.
   */
  private updateWobble(deltaTime: number): void {
    const wobbleDelta =
      this.wobbleAmplitude *
      Math.sin(Constants.TWO_PI * this.wobbleFrequency * deltaTime);
    this.rotationAngle = (this.rotationAngle + wobbleDelta) % Constants.TWO_PI;
  }

  /**
   * Calculates radiated energy over the time step using the Stefan-Boltzmann law.
   * Approximates the sensor's surface area based on density and mass.
   * @param deltaTime - The time step in seconds.
   */
  private calculateRadiation(deltaTime: number): void {
    if (this.temperature <= 0 || this.emissivity <= 0) return;
    const density = 5510; // Approximate density in kg/m³.
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
   * Computes external forces from neighboring sensors.
   * This is a placeholder for future detailed force computations.
   * @param sensors - An array of neighboring sensors.
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
          // Placeholder for force calculation.
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
    if (!state) {
      throw new Error('State cannot be null or undefined.');
    }
    this.state = state;
  }

  /**
   * Adds a neighbor sensor for local interactions.
   * @param sensor - The neighbor sensor to add.
   */
  public addNeighbor(sensor: Sensor): void {
    if (!sensor) {
      throw new Error('Neighbor sensor cannot be null or undefined.');
    }
    this.neighbors.push(sensor);
  }

  /**
   * Removes a neighbor sensor by its ID.
   * @param sensorId - The identifier of the sensor to remove.
   */
  public removeNeighbor(sensorId: string): void {
    this.neighbors = this.neighbors.filter(s => s.id !== sensorId);
  }
}
