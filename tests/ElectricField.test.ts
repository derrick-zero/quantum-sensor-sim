import { ElectricField } from '../src/electricity/ElectricField';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { Constants } from '../src/core/Constants';

describe('ElectricField Module', () => {
  test('calculateFieldAtPoint returns correct field for a single sensor', () => {
    // Create a sensor with a positive charge at the origin.
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(), // Initial velocity (unused here)
      5, // Mass (not used in field calculation)
      1 // Charge = 1 coulomb
    );

    // Evaluation point at (0, 1, 0). Distance r = 1.
    const evalPoint = new Vector3(0, 1, 0);

    // According to Coulomb's law: E = k * q / r².
    const expectedMagnitude =
      (Constants.COULOMB_CONSTANT * sensor.charge) / (1 * 1);
    // Since the sensor is at the origin and the point is (0,1,0), the field should be directed along +Y.
    const expectedField = new Vector3(0, expectedMagnitude, 0);

    const computedField = ElectricField.calculateFieldAtPoint(
      sensor,
      evalPoint
    );

    expect(computedField.x).toBeCloseTo(expectedField.x, 5);
    expect(computedField.y).toBeCloseTo(expectedField.y, 5);
    expect(computedField.z).toBeCloseTo(expectedField.z, 5);
  });

  test("calculateFieldAtPoint throws error when evaluation point is sensor's position", () => {
    // Create a sensor at (0, 0, 0) with charge 1.
    const sensor = new Sensor(
      'sensor1',
      new Vector3(0, 0, 0),
      new Vector3(),
      5,
      1
    );

    // Set evaluation point identical to sensor position.
    const evalPoint = new Vector3(0, 0, 0);

    expect(() => {
      ElectricField.calculateFieldAtPoint(sensor, evalPoint);
    }).toThrow('Evaluation point cannot be the same as the sensor position.');
  });

  test('calculateNetField returns correct net field from multiple sensors', () => {
    // Create two sensors with equal and opposite charges.
    const sensorA = new Sensor(
      'sensorA',
      new Vector3(0, 0, 0),
      new Vector3(),
      5,
      1 // Charge +1
    );
    const sensorB = new Sensor(
      'sensorB',
      new Vector3(0, 2, 0),
      new Vector3(),
      5,
      -1 // Charge -1
    );

    // Evaluation point at (0, 1, 0) is equidistant from both.
    const evalPoint = new Vector3(0, 1, 0);

    // Compute the field for each sensor separately.
    const fieldA = ElectricField.calculateFieldAtPoint(sensorA, evalPoint);
    const fieldB = ElectricField.calculateFieldAtPoint(sensorB, evalPoint);

    // Expected net field is the sum of fieldA and fieldB.
    const expectedNetField = fieldA.add(fieldB);

    const computedNetField = ElectricField.calculateNetField(
      [sensorA, sensorB],
      evalPoint
    );

    expect(computedNetField.x).toBeCloseTo(expectedNetField.x, 5);
    expect(computedNetField.y).toBeCloseTo(expectedNetField.y, 5);
    expect(computedNetField.z).toBeCloseTo(expectedNetField.z, 5);
  });
});
