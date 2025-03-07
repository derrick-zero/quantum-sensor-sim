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
    // Verify extra dynamic properties.
    expect(sensor.radius).toBe(0.2);
    expect(sensor.spin).toBe(0);
    // Check default color based on charge:
    // Positive -> "#ff0000", Negative -> "#00ffff", Zero -> "#888888"
    if (sensor.charge > 0) {
      expect(sensor.color).toBe('#ff0000');
    } else if (sensor.charge < 0) {
      expect(sensor.color).toBe('#00ffff');
    } else {
      expect(sensor.color).toBe('#888888');
    }
  });

  test('applyForce updates acceleration correctly', () => {
    const sensor = new Sensor('S1');
    const force = new Vector3(10, 0, 0);
    sensor.applyForce(force);
    // Acceleration should equal force divided by mass.
    expect(sensor.acceleration.x).toBeCloseTo(10 / sensor.mass, 5);
    expect(sensor.acceleration.y).toBeCloseTo(0, 5);
    expect(sensor.acceleration.z).toBeCloseTo(0, 5);
  });

  test('update method updates velocity and position', () => {
    const sensor = new Sensor('S1', new Vector3(0, 0, 0), new Vector3(1, 1, 1));
    sensor.acceleration = new Vector3(2, 2, 2); // constant acceleration
    sensor.update(1); // dt = 1 sec

    // Velocity: initial (1,1,1) + (2,2,2) = (3,3,3)
    expect(sensor.velocity.x).toBeCloseTo(3, 5);
    expect(sensor.velocity.y).toBeCloseTo(3, 5);
    expect(sensor.velocity.z).toBeCloseTo(3, 5);

    // Position: initial (0,0,0) + new velocity (3,3,3) = (3,3,3)
    expect(sensor.position.x).toBeCloseTo(3, 5);
    expect(sensor.position.y).toBeCloseTo(3, 5);
    expect(sensor.position.z).toBeCloseTo(3, 5);
  });

  test('update method applies vibration effects', () => {
    const sensor = new Sensor('S1');
    // Set non-zero vibration parameters.
    sensor.vibrationAmplitude = new Vector3(1, 1, 1);
    sensor.vibrationFrequency = new Vector3(1, 1, 1);
    sensor.vibrationPhase = new Vector3(0, 0, 0);

    const oldPosition = sensor.position.clone();
    sensor.update(0.5); // dt = 0.5 sec

    // Check that at least one coordinate changes due to vibration.
    const newPosition = sensor.position;
    expect(newPosition.x).not.toEqual(oldPosition.x);
    expect(newPosition.y).not.toEqual(oldPosition.y);
    expect(newPosition.z).not.toEqual(oldPosition.z);
  });

  test('update method applies rotation and wobble', () => {
    const sensor = new Sensor('S1');
    // Test rotation: set a non-zero rotation speed.
    sensor.rotationSpeed = Math.PI / 2; // 90° per second.
    sensor.wobbleAmplitude = 0;
    const initialRotation = sensor.rotationAngle;
    sensor.update(1); // dt = 1 sec -> rotationAngle increases by π/2.
    expect(sensor.rotationAngle).toBeCloseTo(
      (initialRotation + Math.PI / 2) % Constants.TWO_PI,
      5
    );

    // Test wobble: with zero rotationSpeed and a non-zero wobble.
    sensor.rotationSpeed = 0;
    sensor.wobbleAmplitude = 0.1;
    sensor.wobbleFrequency = 1; // 1 Hz.
    const prevRotation = sensor.rotationAngle;
    sensor.update(1); // dt = 1 sec, since sin(2π)=0, wobble effect should be nearly 0.
    expect(sensor.rotationAngle).toBeCloseTo(prevRotation, 5);
  });

  test('calculateRadiation increases radiatedEnergy when temperature > 0', () => {
    const sensor = new Sensor('S1');
    sensor.temperature = 300; // Kelvin.
    sensor.emissivity = 0.9;
    const initialEnergy = sensor.radiatedEnergy;
    sensor.update(1); // dt = 1 sec.
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
    Logger.configure({ level: LogLevel.DEBUG });
    console.debug = jest.fn();

    const sensor = new Sensor('S1');
    const neighbor = new Sensor('S2', new Vector3(5, 0, 0));
    sensor.calculateForces([neighbor]);

    expect(console.debug).toHaveBeenCalled();
    const loggedMessage = (console.debug as jest.Mock).mock.calls[0][0];
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

  // Additional tests for new utility methods:

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
    const returnedTarget = target.copy(vector);
    expect(target).toEqual(vector);
    expect(returnedTarget).toBe(target);
  });

  test('static zero() returns a zero vector', () => {
    const zeroVector = Vector3.zero();
    expect(zeroVector).toEqual(new Vector3(0, 0, 0));
  });

  test('rotateAroundAxis rotates vector correctly', () => {
    // Rotate vector (1,0,0) by 90° about the z-axis.
    const vector = new Vector3(1, 0, 0);
    const axis = new Vector3(0, 0, 1);
    const angle = Math.PI / 2;
    const rotated = vector.rotateAroundAxis(axis, angle);
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
    expect(rotated.z).toBeCloseTo(0, 5);
  });
});
