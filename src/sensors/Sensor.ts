import { Vector3 } from '../core/Vector3';
import { SensorState } from './SensorState';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';

/**
 * Represents an individual sensor used within the simulation.
 * Each sensor has physical properties (position, velocity, acceleration, mass, charge),
 * a state, and a visual color determined by its charge using continuous HSL mapping.
 * Additional dynamic attributes (such as vibration, rotation/wobble, and radiation)
 * are provided as placeholders for future enhancements.
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
   * @throws Error if mass is <= 0.
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
    this.temperature = 0; // Sensor is non-radiative if temperature is zero.
    this.emissivity = Constants.DEFAULT_EMISSIVITY;
    this.radiatedEnergy = 0;

    // Initialize extra dynamic properties.
    this.radius = Constants.DEFAULT_SENSOR_RADIUS;
    this.spin = 0;

    // Compute and assign the sensor's initial color using continuous HSL mapping.
    this.color = this.computeColor(this.charge);
  }

  /**
   * Computes the sensor's display color based on its electrical charge using HSL interpolation.
   * - For neutral sensors (charge === 0), returns a neutral color (#FFFFFF).
   * - For positive sensors, maps the normalized charge (charge / MAX_SENSOR_CHARGE) to a hue
   *   range from 30° (low positive) to 0° (high positive).
   * - For negative sensors, maps the normalized charge (abs(charge) / MAX_SENSOR_CHARGE)
   *   to a hue range from 180° (low negative) to 240° (high negative).
   * Saturation is fixed at 100% and lightness at 50%.
   * @param charge - The sensor's electrical charge.
   * @returns A CSS HSL color string.
   */
  private computeColor(charge: number): string {
    if (charge === 0) return '#FFFFFF';

    const maxCharge = Constants.MAX_SENSOR_CHARGE;
    const normalizedCharge = Math.min(Math.abs(charge) / maxCharge, 1);
    let hue: number;
    if (charge > 0) {
      // Positive charges yield hues from 30° (lower charge) down to 0° (higher charge).
      hue = 30 - 30 * normalizedCharge;
    } else {
      // Negative charges yield hues from 180° (lower charge) up to 240° (higher charge magnitude).
      hue = 180 + 60 * normalizedCharge;
    }
    return `hsl(${Math.round(hue)}, 100%, 50%)`;
  }

  /**
   * Applies a force vector to the sensor, updating its acceleration.
   * Uses Newton's second law: F = m * a.
   * @param force - The force vector to apply.
   */
  public applyForce(force: Vector3): void {
    const accelerationDelta = force.divideScalar(this.mass);
    this.acceleration = this.acceleration.add(accelerationDelta);
  }

  /**
   * Updates the sensor's state over a given time step.
   * Updates velocity and position, resets acceleration, and triggers dynamic behavior updates.
   * @param deltaTime - The time step in seconds (must be > 0).
   * @throws Error if deltaTime is <= 0.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    // Update velocity and position according to current acceleration.
    this.velocity = this.velocity.add(
      this.acceleration.multiplyScalar(deltaTime)
    );
    this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
    this.acceleration = Vector3.zero();

    // Placeholder for future dynamic behavior updates:
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
   * Approximates sensor surface area based on mass and density.
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
   * Placeholder for future detailed force computations.
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
          // Placeholder logic for computing forces.
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
   * @throws Error if state is null or undefined.
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
   * @throws Error if sensor is null or undefined.
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
