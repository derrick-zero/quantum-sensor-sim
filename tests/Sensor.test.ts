/// <reference types="jest" />

import { Vector3 } from '../src/core/Vector3';
import { Sensor } from '../src/sensors/Sensor';
import { SensorState } from '../src/sensors/SensorState';
import { Constants } from '../src/core/Constants';
import { Logger } from '../src/core/Logger';

describe('Sensor Class Unit Tests', () => {
  const originalMathRandom = Math.random;

  afterEach(() => {
    // Restore Math.random even though our new implementation uses no randomness.
    Math.random = originalMathRandom;
  });

  test('should throw error when mass is not greater than zero', () => {
    expect(
      () => new Sensor('S_invalid', new Vector3(), new Vector3(), 0, 0)
    ).toThrow('Mass must be greater than zero.');
  });

  test('should create sensor with correct default properties', () => {
    const sensor = new Sensor('S1');
    expect(sensor.id).toEqual('S1');
    expect(sensor.position).toEqual(new Vector3());
    expect(sensor.velocity).toEqual(new Vector3());
    expect(sensor.acceleration).toEqual(Vector3.zero());
    expect(sensor.mass).toEqual(Constants.DEFAULT_SENSOR_MASS);
    expect(sensor.charge).toEqual(Constants.DEFAULT_SENSOR_CHARGE);
    expect(sensor.state).toEqual(SensorState.ACTIVE);
    expect(sensor.neighbors).toEqual([]);
    expect(sensor.vibrationAmplitude).toEqual(Vector3.zero());
    expect(sensor.rotationAxis).toEqual(new Vector3(0, 1, 0));
    expect(sensor.rotationAngle).toEqual(0);
    expect(sensor.rotationSpeed).toEqual(0);
    expect(sensor.wobbleAmplitude).toEqual(0);
    expect(sensor.wobbleFrequency).toEqual(0);
    expect(sensor.temperature).toEqual(0);
    expect(sensor.emissivity).toEqual(Constants.DEFAULT_EMISSIVITY);
    expect(sensor.radiatedEnergy).toEqual(0);
    expect(sensor.radius).toEqual(Constants.DEFAULT_SENSOR_RADIUS);
    expect(sensor.spin).toEqual(0);
    // For a neutral sensor (charge === 0), computeColor should return #FFFFFF.
    expect(sensor.color).toEqual('#FFFFFF');
  });

  // Continuous Color Mapping tests.

  test('should compute correct color for positive sensor with charge 5', () => {
    // For charge = 5, normalized charge = 5 / 10 = 0.5
    // hue = 30 - 30 * 0.5 = 15
    // Expected color: "hsl(15, 100%, 50%)"
    const sensor = new Sensor(
      'S2',
      new Vector3(),
      new Vector3(),
      1,
      5,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual('hsl(15, 100%, 50%)');
  });

  test('should compute correct color for positive sensor with charge 10', () => {
    // For charge = 10, normalized charge = 1, hue = 30 - 30 = 0.
    // Expected color: "hsl(0, 100%, 50%)"
    const sensor = new Sensor(
      'S3',
      new Vector3(),
      new Vector3(),
      1,
      10,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual('hsl(0, 100%, 50%)');
  });

  test('should compute correct color for negative sensor with charge -5', () => {
    // For charge = -5, normalized charge = 0.5, hue = 180 + 60 * 0.5 = 210.
    // Expected color: "hsl(210, 100%, 50%)"
    const sensor = new Sensor(
      'S4',
      new Vector3(),
      new Vector3(),
      1,
      -5,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual('hsl(210, 100%, 50%)');
  });

  test('should compute correct color for negative sensor with charge -10', () => {
    // For charge = -10, normalized charge = 1, hue = 180 + 60 * 1 = 240.
    // Expected color: "hsl(240, 100%, 50%)"
    const sensor = new Sensor(
      'S5',
      new Vector3(),
      new Vector3(),
      1,
      -10,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual('hsl(240, 100%, 50%)');
  });

  test('applyForce should correctly update acceleration', () => {
    const sensor = new Sensor('S6');
    const force = new Vector3(10, 0, 0);
    sensor.applyForce(force);
    const expectedAcc = force.divideScalar(sensor.mass);
    expect(sensor.acceleration.x).toBeCloseTo(expectedAcc.x);
    expect(sensor.acceleration.y).toBeCloseTo(expectedAcc.y);
    expect(sensor.acceleration.z).toBeCloseTo(expectedAcc.z);
  });

  test('update should correctly update velocity and position', () => {
    const sensor = new Sensor('S7', new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    sensor.acceleration = new Vector3(2, 2, 2);
    const dt = 1;
    const expectedVelocity = new Vector3(3, 3, 3); // 1 + 2*1
    const expectedPosition = new Vector3(3, 3, 3); // 0 + velocity*1
    sensor.update(dt);
    expect(sensor.velocity.x).toBeCloseTo(expectedVelocity.x);
    expect(sensor.velocity.y).toBeCloseTo(expectedVelocity.y);
    expect(sensor.velocity.z).toBeCloseTo(expectedVelocity.z);
    expect(sensor.position.x).toBeCloseTo(expectedPosition.x);
    expect(sensor.position.y).toBeCloseTo(expectedPosition.y);
    expect(sensor.position.z).toBeCloseTo(expectedPosition.z);
  });

  test('updateVibration should modify position when vibration parameters are set', () => {
    const sensor = new Sensor('S_vibration');
    sensor.vibrationAmplitude = new Vector3(1, 0, 0);
    sensor.vibrationFrequency = new Vector3(1, 0, 0); // 1 Hz
    sensor.vibrationPhase = new Vector3(0, 0, 0);

    const initialPos = sensor.position.clone();
    sensor.update(0.1);
    const expectedOffset = Math.sin(0.2 * Math.PI); // approx 0.5878
    expect(sensor.position.x).toBeCloseTo(initialPos.x + expectedOffset, 2);
  });

  test('updateRotation should increase rotationAngle when rotationSpeed is set', () => {
    const sensor = new Sensor('S_rotation');
    sensor.rotationSpeed = Math.PI / 2; // 90° per second.
    const initialAngle = sensor.rotationAngle;
    sensor.update(1);
    const expectedAngle = (initialAngle + Math.PI / 2) % Constants.TWO_PI;
    expect(sensor.rotationAngle).toBeCloseTo(expectedAngle, 5);
  });

  test('updateWobble should modify rotationAngle when wobble parameters are set', () => {
    const sensor = new Sensor('S_wobble');
    sensor.rotationSpeed = 0; // Isolate wobble effect.
    sensor.wobbleAmplitude = Math.PI / 4; // 45° amplitude.
    sensor.wobbleFrequency = 1; // 1 Hz.
    const initialAngle = sensor.rotationAngle;
    sensor.update(0.25);
    // Check that rotationAngle changed; a strict value is hard to predict, so ensure it's not equal.
    expect(sensor.rotationAngle).not.toBeCloseTo(initialAngle, 2);
  });

  test('calculateRadiation should increase radiatedEnergy for positive temperature', () => {
    const sensor = new Sensor('S_radiation');
    sensor.temperature = 300; // Kelvin.
    sensor.emissivity = 0.9;
    const initialEnergy = sensor.radiatedEnergy;
    sensor.update(1);
    expect(sensor.radiatedEnergy).toBeGreaterThan(initialEnergy);
  });

  test('calculateForces should not throw error for empty sensor array', () => {
    const sensor = new Sensor('S8');
    expect(() => sensor.calculateForces([])).not.toThrow();
  });

  test('calculateForces should call Logger.debug for each other sensor', () => {
    const sensorA = new Sensor('A', new Vector3(), new Vector3(), 1, 5);
    const sensorB = new Sensor('B', new Vector3(), new Vector3(), 1, 5);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    sensorA.calculateForces([sensorB]);
    expect(debugSpy).toHaveBeenCalledWith(
      `Computing force between sensor A and B`,
      'Sensor.calculateForces'
    );
    debugSpy.mockRestore();
  });

  test('calculateForces should catch and log errors when Logger.debug fails', () => {
    const sensorA = new Sensor('A', new Vector3(), new Vector3(), 1, 5);
    const sensorB = new Sensor('B', new Vector3(), new Vector3(), 1, 5);
    // Override Logger.debug to throw an error.
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {
      throw new Error('Test debug error');
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const errorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    sensorA.calculateForces([sensorB]);
    expect(errorSpy).toHaveBeenCalledWith(
      `Error calculating force: Test debug error`,
      'Sensor.calculateForces'
    );
    debugSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test('setState should update sensor state', () => {
    const sensor = new Sensor('S9');
    sensor.setState(SensorState.INACTIVE);
    expect(sensor.state).toEqual(SensorState.INACTIVE);
  });

  test('addNeighbor and removeNeighbor should manage neighbors correctly', () => {
    const sensor1 = new Sensor('S10');
    const sensor2 = new Sensor('S11');
    sensor1.addNeighbor(sensor2);
    expect(sensor1.neighbors.length).toEqual(1);
    sensor1.removeNeighbor('S11');
    expect(sensor1.neighbors.length).toEqual(0);
  });

  test('update() should throw error when deltaTime is non-positive', () => {
    const sensor = new Sensor('S_updateError');
    expect(() => sensor.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => sensor.update(-0.1)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('setState() should throw error when state argument is null or undefined', () => {
    const sensor = new Sensor('S_stateError');
    // @ts-expect-error: Testing error for null state.
    expect(() => sensor.setState(null)).toThrow(
      'State cannot be null or undefined.'
    );
    // @ts-expect-error: Testing error for undefined state.
    expect(() => sensor.setState(undefined)).toThrow(
      'State cannot be null or undefined.'
    );
  });

  test('addNeighbor() should throw error when sensor is null or undefined', () => {
    const sensor = new Sensor('S_neighborError');
    // @ts-expect-error: Testing error for null neighbor.
    expect(() => sensor.addNeighbor(null)).toThrow(
      'Neighbor sensor cannot be null or undefined.'
    );
    // @ts-expect-error: Testing error for undefined neighbor.
    expect(() => sensor.addNeighbor(undefined)).toThrow(
      'Neighbor sensor cannot be null or undefined.'
    );
  });
});
