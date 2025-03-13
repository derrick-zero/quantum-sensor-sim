/// <reference types="jest" />

import { expect } from '@jest/globals';
import { MagneticField } from '../src/magnetism/MagneticField';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { Constants } from '../src/core/Constants';
import { Logger, LogLevel } from '../src/core/Logger';

describe('MagneticField Module Unit Tests', () => {
  beforeAll(() => {
    // Ensure logger is at DEBUG level for tests requiring debug outputs.
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
  });

  test('calculateFieldAtPoint returns correct magnetic field for a single sensor', () => {
    // Create a sensor at the origin, with velocity along the x-axis and charge 1.
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      5,
      1
    );
    // Evaluation point at (0, 1, 0); rVector = [0,1,0], distance = 1.
    const evalPoint = new Vector3(0, 1, 0);

    // According to Biot–Savart for a point charge:
    // B = (μ₀ / (4π)) * (q (v x r)) / |r|³.
    const mu0 = Constants.PERMEABILITY_OF_FREE_SPACE;
    const factor = mu0 / (4 * Math.PI);
    // v = [1,0,0], r = [0,1,0] so v x r = [0,0,1].
    const expectedMagnitude = factor * sensor.charge; // since |r|^3 = 1
    const expectedField = new Vector3(0, 0, expectedMagnitude);

    const computedField = MagneticField.calculateFieldAtPoint(
      sensor,
      evalPoint
    );

    expect(computedField.x).toBeCloseTo(expectedField.x, 5);
    expect(computedField.y).toBeCloseTo(expectedField.y, 5);
    expect(computedField.z).toBeCloseTo(expectedField.z, 5);
  });

  test('calculateFieldAtPoint throws error when evaluation point equals sensor position', () => {
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(),
      5,
      1
    );
    expect(() =>
      MagneticField.calculateFieldAtPoint(sensor, new Vector3(0, 0, 0))
    ).toThrow('Evaluation point cannot be the same as the sensor position.');
  });

  test('calculateFieldAtPointTimeDependent modulates static field correctly', () => {
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      5,
      1
    );
    const evalPoint = new Vector3(0, 1, 0);
    const staticField = MagneticField.calculateFieldAtPoint(sensor, evalPoint);
    // Using time = 0.25 sec and frequency = 1 Hz:
    // modulation factor = sin(2π * 1 * 0.25) = sin(π/2) = 1.
    const time = 0.25;
    const modulatedField = MagneticField.calculateFieldAtPointTimeDependent(
      sensor,
      evalPoint,
      time,
      1
    );
    // Since modulation factor is 1, modulatedField should equal staticField.
    expect(modulatedField.x).toBeCloseTo(staticField.x, 5);
    expect(modulatedField.y).toBeCloseTo(staticField.y, 5);
    expect(modulatedField.z).toBeCloseTo(staticField.z, 5);
  });

  test('calculateNetField returns correct net field from multiple sensors', () => {
    // Create two sensors with opposite charges placed symmetrically.
    const sensorA = new Sensor(
      'A',
      new Vector3(-1, 0, 0),
      new Vector3(1, 0, 0),
      5,
      1
    );
    const sensorB = new Sensor(
      'B',
      new Vector3(1, 0, 0),
      new Vector3(1, 0, 0),
      5,
      -1
    );
    const evalPoint = new Vector3(0, 0, 0);
    const fieldA = MagneticField.calculateFieldAtPoint(sensorA, evalPoint);
    const fieldB = MagneticField.calculateFieldAtPoint(sensorB, evalPoint);
    const expectedNetField = fieldA.add(fieldB);
    const computedNetField = MagneticField.calculateNetField(
      [sensorA, sensorB],
      evalPoint
    );
    expect(computedNetField.x).toBeCloseTo(expectedNetField.x, 5);
    expect(computedNetField.y).toBeCloseTo(expectedNetField.y, 5);
    expect(computedNetField.z).toBeCloseTo(expectedNetField.z, 5);
  });

  test('coupleWithElectricField scales magnetic field appropriately', () => {
    const magneticField = new Vector3(0, 2, 0);
    // Create an electric field with a known magnitude.
    const electricField = new Vector3(50, 50, 0); // magnitude ≈ 70.71
    const expectedScaling = 1 + 0.01 * electricField.magnitude();
    const expectedField = magneticField.multiplyScalar(expectedScaling);
    const coupledField = MagneticField.coupleWithElectricField(
      magneticField,
      electricField
    );
    expect(coupledField.x).toBeCloseTo(expectedField.x, 5);
    expect(coupledField.y).toBeCloseTo(expectedField.y, 5);
    expect(coupledField.z).toBeCloseTo(expectedField.z, 5);
  });

  test('generateElectromagneticWave returns a valid EM wave structure', () => {
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      5,
      1
    );
    const evalPoint = new Vector3(0, 1, 0);
    const time = 0.5;
    const result = MagneticField.generateElectromagneticWave(
      sensor,
      evalPoint,
      time
    );

    // Check for required properties.
    expect(result).toHaveProperty('electricField');
    expect(result).toHaveProperty('magneticField');
    expect(result).toHaveProperty('frequency');

    // Since electricField is a placeholder (zero vector), it should be [0,0,0].
    expect(result.electricField.x).toBeCloseTo(0, 5);
    expect(result.electricField.y).toBeCloseTo(0, 5);
    expect(result.electricField.z).toBeCloseTo(0, 5);

    // Frequency should be 60 as defined in generateElectromagneticWave.
    expect(result.frequency).toBe(60);

    // Check that magneticField is computed.
    // We compute the static magnetic field and its time-dependent modulation factor.
    const staticField = MagneticField.calculateFieldAtPoint(sensor, evalPoint);
    const modulation = Math.sin(Constants.TWO_PI * 60 * time);
    const expectedMagneticField = staticField.multiplyScalar(modulation);
    expect(result.magneticField.x).toBeCloseTo(expectedMagneticField.x, 5);
    expect(result.magneticField.y).toBeCloseTo(expectedMagneticField.y, 5);
    expect(result.magneticField.z).toBeCloseTo(expectedMagneticField.z, 5);
  });
});
