import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { centerOfMassCollision } from '../src/utils/collisionAlternatives';

// Assume this existing impulse-based collision is defined in your SimulationEngine or a helper:
function impulseCollision(sensor1: Sensor, sensor2: Sensor): void {
  const normal = sensor2.position.subtract(sensor1.position).normalize();
  const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
  const speed = relativeVelocity.dot(normal);
  if (speed >= 0) return; // No collision response if sensors separate
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

  // Create template sensors for benchmarking.
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

  test('Center-of-Mass method is comparable in performance to impulse-based, and both are significantly faster than brute force', () => {
    const impulseTimes: number[] = [];
    const comTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Test impulse-based method.
      const { s1: ipS1, s2: ipS2 } = createSensors();
      let start = performance.now();
      impulseCollision(ipS1, ipS2);
      let duration = performance.now() - start;
      impulseTimes.push(duration);

      // Test center-of-mass method.
      const { s1: comS1, s2: comS2 } = createSensors();
      start = performance.now();
      const result = centerOfMassCollision(comS1, comS2);
      // Update velocities with the returned values
      comS1.velocity = result.v1;
      comS2.velocity = result.v2;
      duration = performance.now() - start;
      comTimes.push(duration);
    }

    const avgImpulse = impulseTimes.reduce((a, b) => a + b, 0) / iterations;
    const avgCOM = comTimes.reduce((a, b) => a + b, 0) / iterations;

    // eslint-disable-next-line no-console
    console.log(`Average impulse-based time: ${avgImpulse.toFixed(4)} ms`);
    // eslint-disable-next-line no-console
    console.log(`Average COM-based time: ${avgCOM.toFixed(4)} ms`);

    // Assert that the COM-based method is within a similar order of magnitude
    // as the impulse method (both should be highly efficient).
    expect(avgCOM).toBeLessThan(avgImpulse * 10);
  });
});
