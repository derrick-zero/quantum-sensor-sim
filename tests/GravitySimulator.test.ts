/// <reference types="jest" />

import { expect } from '@jest/globals';
import { GravitySimulator } from '../src/gravity/GravitySimulator';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { Constants } from '../src/core/Constants';

describe('GravitySimulator', () => {
  test('calculateGravitationalForce returns correct force between two sensors', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 10, 0), new Vector3(), 10);

    const force = GravitySimulator.calculateGravitationalForce(
      sensorA,
      sensorB
    );
    const expectedForceMagnitude =
      (Constants.GRAVITATIONAL_CONSTANT * sensorA.mass * sensorB.mass) /
      (10 * 10);

    expect(force.y).toBeCloseTo(expectedForceMagnitude, 5);
    expect(force.x).toBeCloseTo(0, 5);
    expect(force.z).toBeCloseTo(0, 5);
  });

  test('applyGravitationalForces updates sensor positions and velocities', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 10, 0), new Vector3(), 10);

    const sensors = [sensorA, sensorB];
    const deltaTime = 1; // 1-second time step

    GravitySimulator.applyGravitationalForces(sensors, deltaTime);

    // Check that velocities and positions have been updated.
    expect(sensorA.velocity.y).not.toEqual(0);
    expect(sensorB.velocity.y).not.toEqual(0);
    expect(sensorA.position.y).not.toEqual(0);
    expect(sensorB.position.y).not.toEqual(10);
  });

  test('simulate runs the gravity simulation over multiple steps', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 10, 0), new Vector3(), 10);

    const sensors = [sensorA, sensorB];
    const deltaTime = 1;
    const steps = 10;

    GravitySimulator.simulate(sensors, deltaTime, steps);

    // After simulation, positions and velocities should have changed.
    expect(sensorA.position.y).not.toEqual(0);
    expect(sensorB.position.y).not.toEqual(10);

    // Sensors should have moved towards each other due to gravity.
    expect(sensorA.position.y).toBeGreaterThan(0);
    expect(sensorB.position.y).toBeLessThan(10);
  });

  test('calculateGravitationalForce throws error when distance is zero', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 0, 0), new Vector3(), 10);

    expect(() => {
      GravitySimulator.calculateGravitationalForce(sensorA, sensorB);
    }).toThrow('Distance between sensors cannot be zero.');
  });

  test('applyGravitationalForces logs warning for sensor with no id', () => {
    // Create a sensor with an empty id.
    const sensorA = new Sensor('', new Vector3(0, 0, 0), new Vector3(), 5, 1);
    const sensorB = new Sensor(
      'B',
      new Vector3(0, 10, 0),
      new Vector3(),
      10,
      1
    );

    const sensors = [sensorA, sensorB];
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {
        /* intentionally empty */
      });
    GravitySimulator.applyGravitationalForces(sensors, 1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Sensor with no id encountered during force initialization.'
    );
    consoleWarnSpy.mockRestore();
  });

  test('applyGravitationalForces handles unknown errors gracefully', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5, 1);
    const sensorB = new Sensor(
      'B',
      new Vector3(0, 10, 0),
      new Vector3(),
      10,
      1
    );

    // Force calculateGravitationalForce to throw a non-Error value.
    jest
      .spyOn(GravitySimulator, 'calculateGravitationalForce')
      .mockImplementation(() => {
        throw 'Non-Error exception';
      });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {
        /* intentionally empty */
      });
    GravitySimulator.applyGravitationalForces([sensorA, sensorB], 1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('An unknown error occurred.');
    consoleErrorSpy.mockRestore();

    // Restore original implementation.
    (GravitySimulator.calculateGravitationalForce as any).mockRestore();
  });
});
