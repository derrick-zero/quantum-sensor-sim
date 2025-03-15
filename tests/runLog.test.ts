// tests/runLog.test.ts

import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { Logger } from '../src/core/Logger';
import { RunEvent } from '../src/utils/runLogTypes';

describe('Run Log Recording', () => {
  afterEach(() => {
    Logger.clearRunLog();
  });

  test('should record a collision event when collision resolution is invoked', () => {
    // Create two sensors with positions and velocities to force a collision.
    // Sensor1 is moving left (i.e., negative x) while sensor2 is moving right.
    const sensor1 = new Sensor(
      'S1',
      new Vector3(0, 0, 0),
      new Vector3(-1, 0, 0),
      1,
      1,
      undefined
    );
    const sensor2 = new Sensor(
      'S2',
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1,
      undefined
    );

    // For a head-on collision, the vector from S1 to S2:
    const normal = sensor2.position.subtract(sensor1.position).normalize(); // (1,0,0)
    // Relative velocity = sensor1.velocity - sensor2.velocity = (-1,0,0) - (1,0,0) = (-2,0,0)
    const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
    const speed = relativeVelocity.dot(normal); // (-2) which is < 0, so collision occurs.

    if (speed < 0) {
      // This condition is now satisfied.
      const totalMass = sensor1.mass + sensor2.mass;
      const impulse = (2 * speed) / totalMass;

      sensor1.velocity = sensor1.velocity.subtract(
        normal.multiplyScalar(impulse * sensor2.mass)
      );
      sensor2.velocity = sensor2.velocity.add(
        normal.multiplyScalar(impulse * sensor1.mass)
      );

      // For testing purposes, we use dummy values for momentum and energy.
      Logger.recordEvent({
        timestamp: Date.now(),
        event: 'collision',
        sensors: [sensor1, sensor2],
        preMomentum: 123, // dummy value
        postMomentum: 123, // dummy value
        preEnergy: 456, // dummy value
        postEnergy: 456, // dummy value
      });
    }

    // Assert that a collision event was recorded.
    expect(
      Logger.runLog.some((e: RunEvent) => e.event === 'collision')
    ).toEqual(true);
  });
});
