// tests/collisionBenchmark.test.ts

import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import {
  bruteForceCollision,
  centerOfMassCollision,
  impulseCollision,
} from '../src/utils/collisionAlternatives';
import { performance } from 'perf_hooks';
import { Constants } from '../src/core/Constants';

describe('Collision Resolution Benchmark', () => {
  // Ensure BENCHMARK_EVENTS exists in Constants; if not, default to over 9000.
  const iterations = Constants.BENCHMARK_EVENTS || 9001;

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
    const bruteTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Benchmark impulse-based collision.
      const { s1: s1Imp, s2: s2Imp } = createSensors();
      const startImpulse = performance.now();
      impulseCollision(s1Imp, s2Imp);
      const durationImpulse = performance.now() - startImpulse;
      impulseTimes.push(durationImpulse);

      // Benchmark center-of-mass collision.
      const { s1: s1COM, s2: s2COM } = createSensors();
      const startCom = performance.now();
      centerOfMassCollision(s1COM, s2COM);
      const durationCom = performance.now() - startCom;
      comTimes.push(durationCom);

      // Benchmark brute-force collision.
      const { s1: s1BF, s2: s2BF } = createSensors();
      const startBrute = performance.now();
      bruteForceCollision(s1BF, s2BF);
      const durationBrute = performance.now() - startBrute;
      bruteTimes.push(durationBrute);
    }

    // Calculate total and average times for each method.
    const totalImpulseTime = impulseTimes.reduce((a, b) => a + b, 0);
    const totalCOMTime = comTimes.reduce((a, b) => a + b, 0);
    const totalBruteTime = bruteTimes.reduce((a, b) => a + b, 0);
    const avgImpulse = totalImpulseTime / iterations;
    const avgCOM = totalCOMTime / iterations;
    const avgBrute = totalBruteTime / iterations;

    // eslint-disable-next-line no-console
    console.log(
      `Impulse-based collision resolution >> events: ${iterations}, time: ${totalImpulseTime.toFixed(
        6
      )} ms, average: ${avgImpulse.toFixed(6)} ms`
    );
    // eslint-disable-next-line no-console
    console.log(
      `Center-of-Mass collision resolution >> events: ${iterations}, time: ${totalCOMTime.toFixed(
        6
      )} ms, average: ${avgCOM.toFixed(6)} ms`
    );
    // eslint-disable-next-line no-console
    console.log(
      `Brute-force collision resolution >> events: ${iterations}, time: ${totalBruteTime.toFixed(
        6
      )} ms, average: ${avgBrute.toFixed(6)} ms`
    );

    // Assert that the COM-based method performs within a comparable factor of the impulse-based method.
    // For example, we expect the COM method not to be more than 2 slower.
    expect(avgCOM).toBeLessThan(avgImpulse * 2);

    // Assert that the brute-force method is slower than the COM method.
    // For example, we expect the brute-force method to be at least 2 slower.
    expect(avgBrute).toBeGreaterThan(avgCOM * 2);
  });
});
