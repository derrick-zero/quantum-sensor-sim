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
   * @throws Error if the distance between sensors is zero.
   */
  public static calculateGravitationalForce(
    sensorA: Sensor,
    sensorB: Sensor
  ): Vector3 {
    const G = Constants.GRAVITATIONAL_CONSTANT;
    const distanceVector = sensorB.position.subtract(sensorA.position);
    const distance = distanceVector.magnitude();

    if (distance === 0) {
      throw new Error('Distance between sensors cannot be zero.');
    }

    const forceMagnitude =
      (G * sensorA.mass * sensorB.mass) / (distance * distance);
    const forceDirection = distanceVector.normalize();
    return forceDirection.multiplyScalar(forceMagnitude);
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
    const forcesMap: Map<string, Vector3> = new Map();

    sensors.forEach(sensor => {
      if (sensor.id) {
        forcesMap.set(sensor.id, Vector3.zero());
      } else {
        console.warn(
          'Sensor with no id encountered during force initialization.'
        );
      }
    });

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

          if (sensorA.id && forcesMap.has(sensorA.id)) {
            const currentForceA = forcesMap.get(sensorA.id);
            if (currentForceA !== undefined) {
              forcesMap.set(sensorA.id, currentForceA.add(forceOnA));
            }
          } else {
            console.warn(
              `SensorA with id ${sensorA.id} not found in forces map.`
            );
          }

          if (sensorB.id && forcesMap.has(sensorB.id)) {
            const currentForceB = forcesMap.get(sensorB.id);
            if (currentForceB !== undefined) {
              forcesMap.set(sensorB.id, currentForceB.add(forceOnB));
            }
          } else {
            console.warn(
              `SensorB with id ${sensorB.id} not found in forces map.`
            );
          }
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

    sensors.forEach(sensor => {
      const netForce = forcesMap.get(sensor.id || '');
      if (netForce) {
        const acceleration = netForce.multiplyScalar(1 / sensor.mass);
        sensor.velocity = sensor.velocity.add(
          acceleration.multiplyScalar(deltaTime)
        );
        sensor.position = sensor.position.add(
          sensor.velocity.multiplyScalar(deltaTime)
        );
      }
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
