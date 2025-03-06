import { SensorSphere } from './SensorSphere';
import { Vector3 } from '../core/Vector3';
import { Logger } from '../core/Logger';
import { Constants } from '../core/Constants';

/**
 * SensorSphereNetwork manages a collection of SensorSphere objects.
 * It allows updates to be applied to all sensor spheres in the network,
 * and in the future, can incorporate inter-sphere interactions.
 */
export class SensorSphereNetwork {
  public spheres: SensorSphere[];

  /**
   * Constructs a new SensorSphereNetwork.
   */
  constructor() {
    this.spheres = [];
  }

  /**
   * Adds a SensorSphere to the network.
   * @param sphere - The SensorSphere instance to add.
   */
  public addSphere(sphere: SensorSphere): void {
    if (!sphere) {
      throw new Error('Cannot add a null or undefined sensor sphere.');
    }
    this.spheres.push(sphere);
    Logger.info(
      `Added sensor sphere ${sphere.id} to the network.`,
      'SensorSphereNetwork.addSphere'
    );
  }

  /**
   * Removes a SensorSphere from the network by its unique identifier.
   * @param sphereId - The unique ID of the sensor sphere to remove.
   */
  public removeSphere(sphereId: string): void {
    this.spheres = this.spheres.filter(sphere => sphere.id !== sphereId);
    Logger.info(
      `Removed sensor sphere ${sphereId} from the network.`,
      'SensorSphereNetwork.removeSphere'
    );
  }

  /**
   * Updates all sensor spheres within the network.
   * Each sphere's update routine is called with the given deltaTime.
   * Also calculates global interactions between spheres (if any).
   * @param deltaTime - The time step in seconds.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    // Update each sphere
    this.spheres.forEach(sphere => sphere.update(deltaTime));

    // Calculate inter-sphere interactions (placeholder)
    this.calculateInteractions();
  }

  /**
   * Placeholder for calculating interactions between sensor spheres.
   * In a full simulation, this method would compute global forces, such as gravitational interactions,
   * among the sensor spheres.
   */
  private calculateInteractions(): void {
    // For example: iterate over all pairs of sensor spheres and compute gravitational forces
    Logger.debug(
      `Calculating interactions among ${this.spheres.length} sensor spheres.`,
      'SensorSphereNetwork.calculateInteractions'
    );
    // TODO: Implement inter-sphere force calculations as needed.
  }

  /**
   * Returns the center of the network by computing the centroid of all sensor sphere centers.
   * @returns A Vector3 representing the centroid of the sensor spheres.
   */
  public computeNetworkCenter(): Vector3 {
    if (this.spheres.length === 0) {
      return new Vector3();
    }

    let sum = new Vector3();
    this.spheres.forEach(sphere => (sum = sum.add(sphere.center)));
    return sum.multiplyScalar(1 / this.spheres.length);
  }
}
