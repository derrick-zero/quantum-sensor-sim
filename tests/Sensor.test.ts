import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { SensorState } from '../src/sensors/SensorState';
import { Constants } from '../src/core/Constants';
import { Logger, LogLevel } from '../src/core/Logger';

describe('Sensor Class Unit Tests', () => {
  beforeAll(() => {
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
  });

  test('Constructor initializes properties correctly', () => {
    const sensor = new Sensor('S1');
    expect(sensor.id).toBe('S1');
    expect(sensor.mass).toBe(Constants.DEFAULT_SENSOR_MASS);
    expect(sensor.charge).toBe(Constants.DEFAULT_SENSOR_CHARGE);
    expect(sensor.state).toBe(SensorState.ACTIVE);
    expect(sensor.velocity).toEqual(new Vector3());
    expect(sensor.vibrationAmplitude).toEqual(new Vector3());
    expect(sensor.rotationAngle).toBe(0);
    expect(sensor.radiatedEnergy).toBe(0);
    // Verify extra dynamic properties.
    expect(sensor.radius).toBe(Constants.DEFAULT_SENSOR_RADIUS);
    expect(sensor.spin).toBe(0);
    // Check default color based on charge.
    if (sensor.charge === 0) {
      expect(sensor.color).toBe('#888888');
    } else if (sensor.charge > 0) {
      expect(sensor.color).toBe('#FF0000');
    } else {
      expect(sensor.color).toBe('#00FFFF');
    }
  });

  test('applyForce updates acceleration correctly', () => {
    const sensor = new Sensor('S1');
    const force = new Vector3(10, 0, 0);
    sensor.applyForce(force);
    // Acceleration should be force divided by mass.
    expect(sensor.acceleration.x).toBeCloseTo(10 / sensor.mass, 5);
    expect(sensor.acceleration.y).toBeCloseTo(0, 5);
    expect(sensor.acceleration.z).toBeCloseTo(0, 5);
  });

  test('update method updates velocity and position', () => {
    // Initial position at origin, velocity (1,1,1) and constant acceleration (2,2,2).
    const sensor = new Sensor('S1', new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    sensor.acceleration = new Vector3(2, 2, 2);
    sensor.update(1); // dt = 1 sec

    // New velocity should be (1,1,1) + (2,2,2) = (3,3,3).
    expect(sensor.velocity.x).toBeCloseTo(3, 5);
    expect(sensor.velocity.y).toBeCloseTo(3, 5);
    expect(sensor.velocity.z).toBeCloseTo(3, 5);

    // New position should be (0,0,0) + (3,3,3)*1 = (3,3,3).
    expect(sensor.position.x).toBeCloseTo(3, 5);
    expect(sensor.position.y).toBeCloseTo(3, 5);
    expect(sensor.position.z).toBeCloseTo(3, 5);
  });

  test('update applies vibration effects', () => {
    const sensor = new Sensor('S1');
    sensor.vibrationAmplitude = new Vector3(1, 1, 1);
    sensor.vibrationFrequency = new Vector3(1, 1, 1);
    sensor.vibrationPhase = new Vector3(0, 0, 0);

    const oldPos = sensor.position.clone();
    sensor.update(0.5);
    const newPos = sensor.position;
    // At least one coordinate should change.
    expect(newPos.x).not.toEqual(oldPos.x);
    expect(newPos.y).not.toEqual(oldPos.y);
    expect(newPos.z).not.toEqual(oldPos.z);
  });

  test('update applies rotation and wobble effects', () => {
    const sensor = new Sensor('S1');
    // Setting rotation speed.
    sensor.rotationSpeed = Math.PI / 2; // 90° per sec.
    sensor.wobbleAmplitude = 0;
    const initRot = sensor.rotationAngle;
    sensor.update(1);
    expect(sensor.rotationAngle).toBeCloseTo(
      (initRot + Math.PI / 2) % Constants.TWO_PI,
      5
    );

    // Set zero rotation speed and add wobble.
    sensor.rotationSpeed = 0;
    sensor.wobbleAmplitude = 0.1;
    sensor.wobbleFrequency = 1;
    const prevRot = sensor.rotationAngle;
    sensor.update(1);
    // Since sin(2π)=0, wobble effect should be near zero.
    expect(sensor.rotationAngle).toBeCloseTo(prevRot, 5);
  });

  test('calculateRadiation increases radiatedEnergy when temperature > 0', () => {
    const sensor = new Sensor('S1');
    sensor.temperature = 300;
    sensor.emissivity = 0.9;
    const initialEnergy = sensor.radiatedEnergy;
    sensor.update(1);
    expect(sensor.radiatedEnergy).toBeGreaterThan(initialEnergy);
  });

  test('setState updates state correctly', () => {
    const sensor = new Sensor('S1');
    sensor.setState(SensorState.MALFUNCTION);
    expect(sensor.state).toBe(SensorState.MALFUNCTION);
  });

  test('addNeighbor and removeNeighbor work as expected', () => {
    const sensor1 = new Sensor('S1');
    const sensor2 = new Sensor('S2');
    sensor1.addNeighbor(sensor2);
    expect(sensor1.neighbors.length).toBe(1);
    sensor1.removeNeighbor('S2');
    expect(sensor1.neighbors.length).toBe(0);
  });

  test('calculateForces logs debug messages (placeholder)', () => {
    Logger.configure({ level: LogLevel.DEBUG });
    console.debug = jest.fn();

    const sensor = new Sensor('S1');
    const neighbor = new Sensor('S2', new Vector3(5, 0, 0));
    sensor.calculateForces([neighbor]);

    expect(console.debug).toHaveBeenCalled();
    const loggedMsg = (console.debug as jest.Mock).mock.calls[0][0];
    expect(loggedMsg).toEqual(
      expect.stringContaining('Computing force between sensor S1 and S2')
    );
    expect(loggedMsg).toEqual(
      expect.stringContaining('Sensor.calculateForces')
    );
  });

  test('update throws error for non-positive deltaTime', () => {
    const sensor = new Sensor('S1');
    expect(() => sensor.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('normalize throws error for zero-length vector', () => {
    const vector = new Vector3(0, 0, 0);
    expect(() => vector.normalize()).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });

  // Tests for new utility methods on Vector3 (alternatively, these may be in Vector3.test.ts)
  test('set() updates vector components correctly', () => {
    const vector = new Vector3();
    vector.set(5, -3, 2);
    expect(vector.x).toBe(5);
    expect(vector.y).toBe(-3);
    expect(vector.z).toBe(2);
  });

  test('copy() copies components correctly and returns the same instance', () => {
    const vector = new Vector3(1, 2, 3);
    const target = new Vector3();
    const returned = target.copy(vector);
    expect(target).toEqual(vector);
    expect(returned).toBe(target);
  });

  test('static zero() returns a zero vector', () => {
    const zero = Vector3.zero();
    expect(zero).toEqual(new Vector3(0, 0, 0));
  });

  test('rotateAroundAxis rotates vector correctly', () => {
    const vector = new Vector3(1, 0, 0);
    const axis = new Vector3(0, 0, 1);
    const rotated = vector.rotateAroundAxis(axis, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
    expect(rotated.z).toBeCloseTo(0, 5);
  });
});
