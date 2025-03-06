// src/gravity/GravitySimulator.ts

import { Sensor } from '../sensors/Sensor';
import { Vector3 } from '../core/Vector3';
import { Constants } from '../core/Constants';

/**
 * Utility class for simulating gravitational interactions among sensors.
 */
export class GravitySimulator {
  /**
   * Calculates the gravitational force exerted on sensorA by sensorB.
   * @param sensorA - The sensor on which the force is acting.
   * @param sensorB - The sensor exerting the force.
   * @returns The gravitational force vector exerted on sensorA by sensorB.
   */
  public static calculateGravitationalForce(
    sensorA: Sensor,
    sensorB: Sensor
  ): Vector3 {
    const G = Constants.GRAVITATIONAL_CONSTANT;

    const distanceVector = sensorB.position.subtract(sensorA.position);
    const distance = distanceVector.magnitude();

    // Avoid division by zero
    if (distance === 0) {
      throw new Error('Distance between sensors cannot be zero.');
    }

    const forceMagnitude =
      (G * sensorA.mass * sensorB.mass) / (distance * distance);
    const forceDirection = distanceVector.normalize();
    const force = forceDirection.multiplyScalar(forceMagnitude);

    return force;
  }

  /**
   * Calculates and applies gravitational forces to all sensors.
   * @param sensors - Array of sensors in the simulation.
   * @param deltaTime - The time step for the simulation update.
   */
  public static applyGravitationalForces(
    sensors: Sensor[],
    deltaTime: number
  ): void {
    // Create a map to store total forces on each sensor to avoid modifying sensor properties during iteration
    const forcesMap: Map<string, Vector3> = new Map();

    // Initialize forces map
    sensors.forEach(sensor => {
      forcesMap.set(sensor.id, new Vector3());
    });

    // Calculate gravitational forces between all pairs of sensors
    for (let i = 0; i < sensors.length; i++) {
      for (let j = i + 1; j < sensors.length; j++) {
        const sensorA = sensors[i];
        const sensorB = sensors[j];

        try {
          const forceOnA = GravitySimulator.calculateGravitationalForce(
            sensorA,
            sensorB
          );
          const forceOnB = forceOnA.multiplyScalar(-1); // Newton's Third Law

          // Accumulate forces
          forcesMap.set(sensorA.id, forcesMap.get(sensorA.id)!.add(forceOnA));
          forcesMap.set(sensorB.id, forcesMap.get(sensorB.id)!.add(forceOnB));
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('An unknown error occurred.');
          }
          continue;
        }
      }
    }

    // Apply forces to sensors
    sensors.forEach(sensor => {
      const netForce = forcesMap.get(sensor.id)!;

      // Update sensor's acceleration based on the net force
      const acceleration = netForce.multiplyScalar(1 / sensor.mass);

      // Update velocity and position
      sensor.velocity = sensor.velocity.add(
        acceleration.multiplyScalar(deltaTime)
      );
      sensor.position = sensor.position.add(
        sensor.velocity.multiplyScalar(deltaTime)
      );
    });
  }

  /**
   * Simulates gravitational interactions over a number of time steps.
   * @param sensors - Array of sensors in the simulation.
   * @param deltaTime - The time step for each simulation update.
   * @param steps - Number of simulation steps to run.
   */
  public static simulate(
    sensors: Sensor[],
    deltaTime: number,
    steps: number
  ): void {
    for (let step = 0; step < steps; step++) {
      GravitySimulator.applyGravitationalForces(sensors, deltaTime);
    }
  }
}
