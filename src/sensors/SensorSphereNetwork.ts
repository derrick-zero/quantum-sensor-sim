// src/sensors/SensorSphereNetwork.ts

import { SensorSphere } from './SensorSphere';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';
import { SensorState } from './SensorState';

/**
 * Represents a network of sensor spheres.
 *
 * SensorSphereNetwork groups multiple SensorSphere instances to simulate higher-level
 * emergent behavior. It provides methods to update the network, calculate aggregated
 * properties, propagate state changes, and compute interactions between sensor spheres.
 * This class is designed to be extended as more complex interaction models are implemented.
 */
export class SensorSphereNetwork {
  public spheres: SensorSphere[];

  /**
   * Constructs a new SensorSphereNetwork.
   * @param spheres - An optional array of SensorSphere instances to initialize the network.
   */
  constructor(spheres: SensorSphere[] = []) {
    this.spheres = spheres;
  }

  /**
   * Adds a SensorSphere to the network.
   * @param sphere - The SensorSphere instance to add.
   */
  public addSphere(sphere: SensorSphere): void {
    if (!sphere) {
      throw new Error('SensorSphere cannot be null or undefined.');
    }
    this.spheres.push(sphere);
    Logger.info(
      `Added sensor sphere ${sphere.id} to the network.`,
      'SensorSphereNetwork.addSphere'
    );
  }

  /**
   * Removes a SensorSphere from the network by its ID.
   * @param sphereId - The identifier of the sensor sphere to remove.
   */
  public removeSphere(sphereId: string): void {
    this.spheres = this.spheres.filter(sphere => sphere.id !== sphereId);
    Logger.info(
      `Removed sensor sphere ${sphereId} from the network.`,
      'SensorSphereNetwork.removeSphere'
    );
  }

  /**
   * Returns the list of sensor spheres in the network.
   */
  public getSpheres(): SensorSphere[] {
    return this.spheres;
  }

  /**
   * Updates all sensor spheres in the network.
   * Calls each sphere's update method with the provided delta time.
   * @param deltaTime - Time step in seconds; must be > 0.
   * @throws Error if deltaTime <= 0.
   */
  public update(deltaTime: number): void {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    for (const sphere of this.spheres) {
      sphere.update(deltaTime);
    }
  }

  /**
   * Updates inter-sphere interactions for all sensor sphere pairs.
   * This method calculates forces (e.g., gravitational-like attraction) between every pair of spheres
   * and applies an acceleration update to each sphere accordingly.
   *
   * Here, we simulate a simple gravitational attraction between spheres:
   *   F = G * (m1 * m2) / (distance^2)
   *
   * The resulting force is then converted to an acceleration (F/m), and applied to update the velocity.
   *
   * @param _deltaTime The simulation time step in seconds.
   */
  public updateInteractions(_deltaTime: number): void {
    const n = this.spheres.length;
    // Iterate through each unique pair (i, j)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const sphereA = this.spheres[i];
        const sphereB = this.spheres[j];

        // Calculate vector between sphere centers and its magnitude.
        const direction = sphereB.center.subtract(sphereA.center);
        const distance = direction.magnitude();

        // Avoid division by zero and ignore interactions if spheres overlap too much.
        if (distance <= 0.001) continue;

        // Compute a gravitational-like force between the spheres.
        const forceMagnitude =
          (Constants.GRAVITATIONAL_CONSTANT * sphereA.mass * sphereB.mass) /
          (distance * distance);
        // Convert force to acceleration (F/m)
        const accelerationA = direction
          .normalize()
          .multiplyScalar(forceMagnitude / sphereA.mass);
        const accelerationB = direction
          .normalize()
          .multiplyScalar(-forceMagnitude / sphereB.mass);

        // Update accelerations for spheres.
        sphereA.acceleration = sphereA.acceleration.add(accelerationA);
        sphereB.acceleration = sphereB.acceleration.add(accelerationB);

        Logger.debug(
          `Inter-sphere force: ${forceMagnitude.toExponential(
            2
          )} N applied between ${sphereA.id} and ${sphereB.id}.`,
          'SensorSphereNetwork.updateInteractions'
        );
      }
    }
  }

  /**
   * Computes and returns the total aggregated mass of the network by summing up the masses of all sensor spheres.
   * @returns The total mass of the network.
   */
  public computeNetworkMass(): number {
    return this.spheres.reduce((total, sphere) => total + sphere.mass, 0);
  }

  /**
   * Propagates a sensor state to all sensor spheres in the network.
   * Optionally, it can also propagate the new state to all sensors contained in each sphere.
   * @param state - The new sensor state to set.
   * @param propagateToSensors - If true, update the state of all sensors within each sphere.
   */
  public setState(
    state: SensorState,
    propagateToSensors: boolean = true
  ): void {
    for (const sphere of this.spheres) {
      sphere.setState(state, propagateToSensors);
    }
  }

  /**
   * Placeholder method to calculate interactions among sensor spheres.
   * For each pair of sensor spheres (excluding self-interaction), it logs interaction information.
   * This can later be extended to compute gravitational or other forces between sensor spheres.
   */
  public calculateInteractions(): void {
    for (let i = 0; i < this.spheres.length; i++) {
      if (i >= this.spheres.length) break;
      for (let j = i + 1; j < this.spheres.length; j++) {
        const sphereA = this.spheres[i];
        const sphereB = this.spheres[j];
        const distance = sphereA.center.distanceTo(sphereB.center);
        if (distance > 0) {
          Logger.debug(
            `Calculating interaction between ${sphereA.id} and ${sphereB.id}.`,
            'SensorSphereNetwork.calculateInteractions'
          );
        }
      }
    }
  }
}
