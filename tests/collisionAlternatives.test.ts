/// <reference types="jest" />

import {
  impulseCollision,
  centerOfMassCollision,
  bruteForceCollision,
  penaltyForceCollision,
} from '../src/utils/collisionAlternatives';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';

describe('impulseCollision', () => {
  const createSensor = (
    id: string,
    position: Vector3,
    velocity: Vector3,
    mass: number = 1
  ): Sensor => {
    // This factory method assumes the Sensor constructor signature is
    // Sensor(id: string, position: Vector3, velocity: Vector3, mass: number, charge: number, state: any)
    // For testing, we pass a dummy charge (1) and an empty object for state.
    return new Sensor(id, position, velocity, mass, 1, undefined);
  };

  test('should not change velocities when sensors are separating (speed >= 0)', () => {
    // Arrange: Set up two sensors that are not colliding.
    // For example, both moving in the same direction.
    const sensor1 = createSensor(
      'S1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0)
    );
    const sensor2 = createSensor(
      'S2',
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 0)
    );

    // Act: Invoke impulseCollision.
    const result = impulseCollision(sensor1, sensor2);

    // Assert: The velocities should remain unchanged.
    expect(result.s1.velocity).toEqual(sensor1.velocity);
    expect(result.s2.velocity).toEqual(sensor2.velocity);
  });

  test('should update velocities when sensors are colliding (speed < 0)', () => {
    // Arrange:
    // Position: sensor1 at (0,0,0), sensor2 at (1,0,0)
    // To force a collision, set sensor1 moving left (-1,0,0) and sensor2 moving right (1,0,0).
    // Then, the relative velocity = sensor1.velocity - sensor2.velocity = (-1,0,0) - (1,0,0) = (-2,0,0)
    // And the normal (from sensor1 to sensor2) = (1,0,0)
    // Dot product: (-2,0,0) • (1,0,0) = -2 which is negative.
    const sensor1 = createSensor(
      'S1',
      new Vector3(0, 0, 0),
      new Vector3(-1, 0, 0)
    );
    const sensor2 = createSensor(
      'S2',
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 0)
    );

    // Act: Run impulseCollision.
    const result = impulseCollision(sensor1, sensor2);

    // Compute expected results:
    // Total mass = 1 + 1 = 2, impulse = (2 * (-2)) / 2 = -2.
    // New sensor1.velocity = (-1,0,0) - ( (1,0,0)*(-2*1) ) = (-1,0,0) - (-2,0,0) = (1,0,0)
    // New sensor2.velocity = (1,0,0) + ( (1,0,0)*(-2*1) ) = (1,0,0) + (-2,0,0) = (-1,0,0)
    const expectedVelocity1 = new Vector3(1, 0, 0);
    const expectedVelocity2 = new Vector3(-1, 0, 0);

    // Assert: Check that sensor velocities swapped.
    expect(result.s1.velocity.x).toBeCloseTo(expectedVelocity1.x);
    expect(result.s1.velocity.y).toBeCloseTo(expectedVelocity1.y);
    expect(result.s1.velocity.z).toBeCloseTo(expectedVelocity1.z);

    expect(result.s2.velocity.x).toBeCloseTo(expectedVelocity2.x);
    expect(result.s2.velocity.y).toBeCloseTo(expectedVelocity2.y);
    expect(result.s2.velocity.z).toBeCloseTo(expectedVelocity2.z);
  });

  describe('centerOfMassCollision', () => {
    test('should compute velocities using COM transformation', () => {
      // Arrange: For equal masses, COM method should also swap velocities.
      const sensor1 = createSensor(
        'S1',
        new Vector3(0, 0, 0),
        new Vector3(-2, 0, 0)
      );
      const sensor2 = createSensor(
        'S2',
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0)
      );
      // Act
      const result = centerOfMassCollision(sensor1, sensor2);
      // Compute center-of-mass velocity:
      // Vcom = ((-2)+2)/2 = 0 so swapped velocities expected:
      const expectedV1 = new Vector3(2, 0, 0);
      const expectedV2 = new Vector3(-2, 0, 0);
      expect(result.v1.x).toBeCloseTo(expectedV1.x);
      expect(result.v1.y).toBeCloseTo(expectedV1.y);
      expect(result.v1.z).toBeCloseTo(expectedV1.z);
      expect(result.v2.x).toBeCloseTo(expectedV2.x);
      expect(result.v2.y).toBeCloseTo(expectedV2.y);
      expect(result.v2.z).toBeCloseTo(expectedV2.z);
    });
  });

  describe('bruteForceCollision', () => {
    test('should converge and return plausible velocities', () => {
      // Arrange: Use two sensors set up for collision.
      const sensor1 = createSensor(
        'S1',
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0)
      );
      const sensor2 = createSensor(
        'S2',
        new Vector3(1, 0, 0),
        new Vector3(1, 0, 0)
      );
      // Act
      const result = bruteForceCollision(sensor1, sensor2);
      // For two sensors of equal mass with a head-on collision, we expect their velocities to approximately swap.
      const expectedVelocity1 = new Vector3(1, 0, 0);
      const expectedVelocity2 = new Vector3(-1, 0, 0);
      expect(result.v1.x).toBeCloseTo(expectedVelocity1.x, 2);
      expect(result.v2.x).toBeCloseTo(expectedVelocity2.x, 2);
    });
  });

  describe('penaltyForceCollision', () => {
    test('should return the same result as impulseCollision (since it currently calls impulseCollision)', () => {
      // Arrange: Create two sensors set up for collision.
      const sensor1 = createSensor(
        'S1',
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0)
      );
      const sensor2 = createSensor(
        'S2',
        new Vector3(1, 0, 0),
        new Vector3(1, 0, 0)
      );
      // Act
      const impulseResult = impulseCollision(sensor1, sensor2);
      const penaltyResult = penaltyForceCollision(sensor1, sensor2);
      // Assert: Since penaltyForceCollision is a stub calling impulseCollision, results should be equal.
      expect(penaltyResult.v1.x).toBeCloseTo(impulseResult.s1.velocity.x, 5);
      expect(penaltyResult.v2.x).toBeCloseTo(impulseResult.s2.velocity.x, 5);
    });
  });
});
