/// <reference types="jest" />

import { Vector3 } from '../src/core/Vector3';
import { Sensor } from '../src/sensors/Sensor';
import { SensorState } from '../src/sensors/SensorState';
import { Constants } from '../src/core/Constants';

describe('Sensor Class Unit Tests', () => {
  const originalMathRandom = Math.random;

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  test('should throw error when mass is not greater than zero', () => {
    expect(
      () => new Sensor('S_invalid', new Vector3(), new Vector3(), 0, 0)
    ).toThrow('Mass must be greater than zero.');
  });

  test('should create sensor with correct default properties', () => {
    // Override Math.random to return 0 so computeColor is deterministic for neutral sensor.
    Math.random = () => 0;
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
    // For a neutral sensor (charge === 0), computeColor should return NEUTRAL_COLOR.
    expect(sensor.color).toEqual(Constants.NEUTRAL_COLOR);
  });

  test('should compute a positive sensor color from the positive palette', () => {
    Math.random = () => 0;
    const sensor = new Sensor(
      'S2',
      new Vector3(),
      new Vector3(),
      1,
      1,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual(Constants.POSITIVE_COLOR_PALETTE[0]);
  });

  test('should compute a negative sensor color from the negative palette', () => {
    Math.random = () => 0;
    const sensor = new Sensor(
      'S3',
      new Vector3(),
      new Vector3(),
      1,
      -1,
      SensorState.ACTIVE
    );
    expect(sensor.color).toEqual(Constants.NEGATIVE_COLOR_PALETTE[0]);
  });

  test('applyForce should correctly update acceleration', () => {
    const sensor = new Sensor('S4');
    const force = new Vector3(10, 0, 0);
    sensor.applyForce(force);
    const expectedAcc = force.divideScalar(sensor.mass);
    expect(sensor.acceleration.x).toBeCloseTo(expectedAcc.x);
    expect(sensor.acceleration.y).toBeCloseTo(expectedAcc.y);
    expect(sensor.acceleration.z).toBeCloseTo(expectedAcc.z);
  });

  test('update should correctly update velocity and position', () => {
    const sensor = new Sensor('S5', new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    sensor.acceleration = new Vector3(2, 2, 2);
    const dt = 1; // 1 second time step
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
    // Use dt = 0.1 sec so sin(2π*1*0.1)= sin(0.2π) ~ sin(0.628) should be nonzero.
    sensor.update(0.1);
    const expectedOffset = Math.sin(0.2 * Math.PI); // approx 0.5878
    expect(sensor.position.x).toBeCloseTo(initialPos.x + expectedOffset, 2);
  });

  test('updateRotation should increase rotationAngle when rotationSpeed is set', () => {
    const sensor = new Sensor('S_rotation');
    sensor.rotationSpeed = Math.PI / 2; // 90 deg per second
    const initialAngle = sensor.rotationAngle;
    sensor.update(1); // dt = 1 sec
    const expectedAngle = (initialAngle + Math.PI / 2) % Constants.TWO_PI;
    expect(sensor.rotationAngle).toBeCloseTo(expectedAngle, 5);
  });

  test('updateWobble should modify rotationAngle when wobble parameters are set', () => {
    const sensor = new Sensor('S_wobble');
    // Set no rotation speed to isolate wobble effect.
    sensor.rotationSpeed = 0;
    sensor.wobbleAmplitude = Math.PI / 4; // 45 deg
    sensor.wobbleFrequency = 1; // 1 Hz
    const initialAngle = sensor.rotationAngle;
    sensor.update(0.25); // Using dt=0.25 sec to capture partial oscillation.
    // We expect the rotationAngle to change due to wobble.
    expect(sensor.rotationAngle).not.toBeCloseTo(initialAngle, 2);
  });

  test('calculateRadiation should increase radiatedEnergy for positive temperature', () => {
    const sensor = new Sensor('S_radiation');
    sensor.temperature = 300; // Kelvin
    sensor.emissivity = 0.9;
    const initialEnergy = sensor.radiatedEnergy;
    sensor.update(1); // dt = 1 sec
    expect(sensor.radiatedEnergy).toBeGreaterThan(initialEnergy);
  });

  test('calculateForces should not throw error for empty sensor array', () => {
    const sensor = new Sensor('S6');
    expect(() => sensor.calculateForces([])).not.toThrow();
  });

  test('setState should update sensor state', () => {
    const sensor = new Sensor('S7');
    sensor.setState(SensorState.INACTIVE);
    expect(sensor.state).toEqual(SensorState.INACTIVE);
  });

  test('addNeighbor and removeNeighbor should manage neighbors correctly', () => {
    const sensor1 = new Sensor('S8');
    const sensor2 = new Sensor('S9');
    sensor1.addNeighbor(sensor2);
    expect(sensor1.neighbors.length).toEqual(1);
    sensor1.removeNeighbor('S9');
    expect(sensor1.neighbors.length).toEqual(0);
  });
});
