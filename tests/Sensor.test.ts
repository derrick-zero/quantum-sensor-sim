import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { SensorState } from '../src/sensors/SensorState';
import { Constants } from '../src/core/Constants';
import { Logger, LogLevel } from '../src/core/Logger';

describe('Sensor Class Unit Tests', () => {
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
  });

  test('applyForce updates acceleration correctly', () => {
    const sensor = new Sensor('S1');
    const force = new Vector3(10, 0, 0);
    sensor.applyForce(force);
    // acceleration should be force divided by mass
    expect(sensor.acceleration.x).toBeCloseTo(10 / sensor.mass, 5);
    expect(sensor.acceleration.y).toBeCloseTo(0, 5);
    expect(sensor.acceleration.z).toBeCloseTo(0, 5);
  });

  test('update method updates velocity and position', () => {
    const sensor = new Sensor('S1', new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    // Set a constant acceleration for testing
    sensor.acceleration = new Vector3(2, 2, 2);
    sensor.update(1); // dt = 1 sec

    // Velocity should be initial velocity + acceleration * dt
    expect(sensor.velocity.x).toBeCloseTo(3, 5);
    expect(sensor.velocity.y).toBeCloseTo(3, 5);
    expect(sensor.velocity.z).toBeCloseTo(3, 5);

    // Position should be updated by velocity * dt; as acceleration was applied and then reset,
    // we expect the new position to be (initial position + new velocity * dt) plus any additional effects.
    // Since default vibration, rotation, etc. are zero, the update should be straightforward.
    expect(sensor.position.x).toBeCloseTo(3, 5);
    expect(sensor.position.y).toBeCloseTo(3, 5);
    expect(sensor.position.z).toBeCloseTo(3, 5);
  });

  test('update method applies vibration effects', () => {
    const sensor = new Sensor('S1');
    // Set non-zero vibration parameters
    sensor.vibrationAmplitude = new Vector3(1, 1, 1);
    sensor.vibrationFrequency = new Vector3(1, 1, 1);
    sensor.vibrationPhase = new Vector3(0, 0, 0);

    // Capture position before updating.
    const oldPosition = sensor.position.clone();
    sensor.update(0.5); // dt = 0.5 sec

    // Since sine will produce some offset, at least one coordinate should differ.
    const newPosition = sensor.position;
    expect(newPosition.x).not.toEqual(oldPosition.x);
    expect(newPosition.y).not.toEqual(oldPosition.y);
    expect(newPosition.z).not.toEqual(oldPosition.z);
  });

  test('update method applies rotation and wobble', () => {
    const sensor = new Sensor('S1');
    // Test rotation by setting a non-zero rotation speed:
    sensor.rotationSpeed = Math.PI / 2; // 90 degrees per second
    sensor.wobbleAmplitude = 0;
    const initialRotation = sensor.rotationAngle;
    sensor.update(1); // dt = 1 sec: rotationAngle should increase by PI/2
    expect(sensor.rotationAngle).toBeCloseTo(
      (initialRotation + Math.PI / 2) % Constants.TWO_PI,
      5
    );

    // Test wobble when rotationSpeed is zero.
    sensor.rotationSpeed = 0;
    sensor.wobbleAmplitude = 0.1;
    sensor.wobbleFrequency = 1; // 1 Hz
    const prevRotation = sensor.rotationAngle;
    sensor.update(1); // For dt=1, expected wobble = 0.1*sin(2π*1*1) = 0 (since sin(2π)=0)
    expect(sensor.rotationAngle).toBeCloseTo(prevRotation, 5);
  });

  test('calculateRadiation increases radiatedEnergy when temperature > 0', () => {
    const sensor = new Sensor('S1');
    sensor.temperature = 300; // Kelvin
    sensor.emissivity = 0.9;
    const initialEnergy = sensor.radiatedEnergy;
    sensor.update(1); // dt = 1 sec, should increase radiatedEnergy
    expect(sensor.radiatedEnergy).toBeGreaterThan(initialEnergy);
  });

  test('setState updates sensor state correctly', () => {
    const sensor = new Sensor('S1');
    sensor.setState(SensorState.MALFUNCTION);
    expect(sensor.state).toBe(SensorState.MALFUNCTION);
  });

  test('addNeighbor and removeNeighbor work correctly', () => {
    const sensor1 = new Sensor('S1');
    const sensor2 = new Sensor('S2');
    sensor1.addNeighbor(sensor2);
    expect(sensor1.neighbors.length).toBe(1);
    sensor1.removeNeighbor('S2');
    expect(sensor1.neighbors.length).toBe(0);
  });

  test('calculateForces logs debug messages (placeholder functionality)', () => {
    // Set logger to DEBUG level to allow debug messages.
    Logger.configure({ level: LogLevel.DEBUG });
    console.debug = jest.fn();

    const sensor = new Sensor('S1');
    const neighbor = new Sensor('S2', new Vector3(5, 0, 0));
    sensor.calculateForces([neighbor]);

    // Ensure that console.debug was called.
    expect(console.debug).toHaveBeenCalled();

    // Get the actual logged message.
    const loggedMessage = (console.debug as jest.Mock).mock.calls[0][0];

    // Check that the logged message contains the expected substrings.
    expect(loggedMessage).toEqual(
      expect.stringContaining('Computing force between sensor S1 and S2')
    );
    expect(loggedMessage).toEqual(
      expect.stringContaining('Sensor.calculateForces')
    );
  });

  test('update throws an error for non-positive deltaTime', () => {
    const sensor = new Sensor('S1');
    expect(() => sensor.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('normalize throws an error for zero-length vector', () => {
    const vector = new Vector3(0, 0, 0);
    expect(() => vector.normalize()).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });
});
