// tests/GravitySimulator.test.ts

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

  test('applyGravitationalForces updates sensors positions and velocities', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 10, 0), new Vector3(), 10);

    const sensors = [sensorA, sensorB];
    const deltaTime = 1; // 1 second time step

    GravitySimulator.applyGravitationalForces(sensors, deltaTime);

    // Check that velocities and positions have been updated
    expect(sensorA.velocity.y).not.toBe(0);
    expect(sensorB.velocity.y).not.toBe(0);

    expect(sensorA.position.y).not.toBe(0);
    expect(sensorB.position.y).not.toBe(10);
  });

  test('simulate runs the gravity simulation over multiple steps', () => {
    const sensorA = new Sensor('A', new Vector3(0, 0, 0), new Vector3(), 5);
    const sensorB = new Sensor('B', new Vector3(0, 10, 0), new Vector3(), 10);

    const sensors = [sensorA, sensorB];
    const deltaTime = 1;
    const steps = 10;

    GravitySimulator.simulate(sensors, deltaTime, steps);

    // Positions and velocities should have changed after simulation
    expect(sensorA.position.y).not.toBe(0);
    expect(sensorB.position.y).not.toBe(10);

    // Sensors should have moved towards each other due to gravity
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
});
