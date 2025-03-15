// tests/collisionBenchmark.test.ts

import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { centerOfMassCollision } from '../src/utils/collisionAlternatives';
import { performance } from 'perf_hooks';

// Impulse-based collision resolution function used in the simulation engine.
function impulseCollision(sensor1: Sensor, sensor2: Sensor): void {
  const normal = sensor2.position.subtract(sensor1.position).normalize();
  const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
  const speed = relativeVelocity.dot(normal);
  if (speed >= 0) return; // No collision response if sensors are separating.
  const totalMass = sensor1.mass + sensor2.mass;
  const impulse = (2 * speed) / totalMass;
  sensor1.velocity = sensor1.velocity.subtract(
    normal.multiplyScalar(impulse * sensor2.mass)
  );
  sensor2.velocity = sensor2.velocity.add(
    normal.multiplyScalar(impulse * sensor1.mass)
  );
}

describe('Collision Resolution Benchmark', () => {
  const iterations = 10000;

  // Helper function to create fresh sensors.
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const createSensors = () => {
    const s1 = new Sensor(
      'S1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1,
      undefined
    );
    const s2 = new Sensor(
      'S2',
      new Vector3(1, 0, 0),
      new Vector3(-1, 0, 0),
      1,
      1,
      undefined
    );
    return { s1, s2 };
  };

  test('Impulse-based method vs. COM method performance', () => {
    const impulseTimes: number[] = [];
    const comTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Benchmark impulse-based collision.
      const { s1: s1Imp, s2: s2Imp } = createSensors();
      let start = performance.now();
      impulseCollision(s1Imp, s2Imp);
      let duration = performance.now() - start;
      impulseTimes.push(duration);

      // Benchmark center-of-mass collision.
      const { s1: s1COM, s2: s2COM } = createSensors();
      start = performance.now();
      const result = centerOfMassCollision(s1COM, s2COM);
      // Assign the calculated velocities.
      s1COM.velocity = result.v1;
      s2COM.velocity = result.v2;
      duration = performance.now() - start;
      comTimes.push(duration);
    }

    const avgImpulse = impulseTimes.reduce((a, b) => a + b, 0) / iterations;
    const avgCOM = comTimes.reduce((a, b) => a + b, 0) / iterations;

    // eslint-disable-next-line no-console
    console.log(`Average impulse-based time: ${avgImpulse.toFixed(4)} ms`);
    // eslint-disable-next-line no-console
    console.log(`Average COM-based time: ${avgCOM.toFixed(4)} ms`);

    // Assert that the COM-based method performs within a comparable factor of the impulse-based method.
    // For example, we expect the COM method not to be more than 2x slower.
    expect(avgCOM).toBeLessThan(avgImpulse * 2);
  });
});
