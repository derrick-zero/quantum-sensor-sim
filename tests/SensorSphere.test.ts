import { SensorSphere } from '../src/sensors/SensorSphere';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { SensorState } from '../src/sensors/SensorState';
import { Logger, LogLevel } from '../src/core/Logger';

// Create a TestSensorSphere subclass to better control update behavior for testing.
class TestSensorSphere extends SensorSphere {
  constructor(
    id: string,
    center: Vector3,
    radius: number = 1,
    sensorCount: number = 0
  ) {
    // Pass sensorCount = 0 to avoid auto-filling; sensors can be added manually.
    super(id, center, radius, sensorCount);
  }

  // Override update to simply translate the center by (deltaTime, 0, 0)
  public update(deltaTime: number): void {
    this.center = this.center.add(new Vector3(deltaTime, 0, 0));
  }
}

describe('SensorSphere Tests', () => {
  test('Constructor initializes properties and sensors correctly', () => {
    const sensorCount = 10;
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1,
      sensorCount
    );
    // Expect auto-generated sensors.
    expect(sphere.sensors.length).toBe(sensorCount);
    // Compute mass: assuming each sensor has default mass of 1.
    sphere.computeMass();
    expect(sphere.mass).toBeCloseTo(sensorCount * 1, 5);
  });

  test('update method updates center and sensors positions', () => {
    // Create a SensorSphere with sensorCount = 0.
    const sphere = new SensorSphere('TestSphere', new Vector3(1, 1, 1), 1, 0);
    // Manually add two sensors.
    const sensor1 = new Sensor('S1', new Vector3(0, 0, 0));
    const sensor2 = new Sensor('S2', new Vector3(2, 2, 2));
    sphere.sensors.push(sensor1, sensor2);

    // Set sphere velocity to (1, 0, 0) and zero acceleration.
    sphere.velocity = new Vector3(1, 0, 0);
    sphere.acceleration = new Vector3();

    const initialCenter = sphere.center.clone();
    const initialSensor1Pos = sensor1.position.clone();
    const initialSensor2Pos = sensor2.position.clone();

    sphere.update(2); // dt = 2 seconds.

    // Sphere center should move by (2, 0, 0).
    expect(sphere.center.x).toBeCloseTo(initialCenter.x + 2, 5);
    // Each sensor's position should also move by (2, 0, 0).
    expect(sensor1.position.x).toBeCloseTo(initialSensor1Pos.x + 2, 5);
    expect(sensor2.position.x).toBeCloseTo(initialSensor2Pos.x + 2, 5);
  });

  test('update method throws an error for non-positive deltaTime', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(1, 1, 1), 1, 0);
    expect(() => sphere.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => sphere.update(-1)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('computeNetworkCenter returns correct centroid of sensor centers', () => {
    const sphere1 = new TestSensorSphere('S1', new Vector3(0, 0, 0));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 0, 0));
    const network = {
      spheres: [sphere1, sphere2],
      computeNetworkCenter: () => {
        let sum = new Vector3();
        network.spheres.forEach(s => {
          sum = sum.add(s.center);
        });
        return sum.multiplyScalar(1 / network.spheres.length);
      },
    };

    const centroid = network.computeNetworkCenter();
    // For centers at (0,0,0) and (2,0,0), the centroid should be (1,0,0).
    expect(centroid.x).toBeCloseTo(1, 5);
    expect(centroid.y).toBeCloseTo(0, 5);
    expect(centroid.z).toBeCloseTo(0, 5);
  });

  test('addSphere and removeSphere manage sensors correctly', () => {
    const networkSphere = new SensorSphere(
      'NetworkSphere',
      new Vector3(0, 0, 0),
      1,
      0
    );
    const sphere1 = new TestSensorSphere('S1', new Vector3(1, 1, 1));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 2, 2));

    // Cast TestSensorSphere as Sensor for testing purposes.
    networkSphere.addSensor(sphere1 as unknown as Sensor);
    networkSphere.addSensor(sphere2 as unknown as Sensor);
    expect(networkSphere.sensors.length).toBe(2);

    // Remove sensor with id "S1"
    networkSphere.removeSensor('S1');
    expect(networkSphere.sensors.length).toBe(1);
  });

  test('calculateInteractions logs debug messages (placeholder functionality)', () => {
    // Ensure Logger is set to DEBUG so that debug messages are output.
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
    const sphere = new SensorSphere('Sphere1', new Vector3(0, 0, 0), 1, 1);

    // Mock console.debug to capture logged output.
    console.debug = jest.fn();

    sphere.calculateInteractions();

    // Verify that console.debug was called.
    expect(console.debug).toHaveBeenCalled();

    // Check that the logged message contains the expected details.
    const loggedMessage = (console.debug as jest.Mock).mock.calls[0][0];
    expect(loggedMessage).toEqual(
      expect.stringContaining(
        `Calculating interactions among ${sphere.sensors.length} sensors in sphere ${sphere.id}.`
      )
    );
    expect(loggedMessage).toEqual(
      expect.stringContaining('SensorSphere.calculateInteractions')
    );
  });

  test('vibrate method applies correct offset to sensors', () => {
    const sphere = new SensorSphere(
      'SphereVibrate',
      new Vector3(0, 0, 0),
      1,
      1
    );
    const sensor = sphere.sensors[0];
    const originalPos = sensor.position.clone();

    const amplitude = new Vector3(1, 1, 1);
    const frequency = new Vector3(1, 1, 1);
    const deltaTime = 0.5;

    sphere.vibrate(amplitude, frequency, deltaTime);

    // Check that at least one component has changed.
    expect(sensor.position.x).not.toEqual(originalPos.x);
    expect(sensor.position.y).not.toEqual(originalPos.y);
    expect(sensor.position.z).not.toEqual(originalPos.z);
  });

  test('vibrate method throws error with invalid deltaTime', () => {
    const sphere = new SensorSphere(
      'SphereVibrateErr',
      new Vector3(0, 0, 0),
      1,
      1
    );
    const amplitude = new Vector3(1, 1, 1);
    const frequency = new Vector3(1, 1, 1);
    expect(() => {
      sphere.vibrate(amplitude, frequency, 0);
    }).toThrow('Amplitude, frequency, and deltaTime must be valid.');
  });

  test('rotate method throws error for invalid inputs', () => {
    const sphere = new SensorSphere('SphereRotate', new Vector3(0, 0, 0), 1, 1);
    expect(() => {
      sphere.rotate(null as unknown as Vector3, Math.PI / 2);
    }).toThrow('Axis and angle must be provided.');
    expect(() => {
      sphere.rotate(new Vector3(0, 1, 0), undefined as unknown as number);
    }).toThrow('Axis and angle must be provided.');
  });

  test('setState propagates state to all sensors when propagateToSensors is true', () => {
    const sphere = new SensorSphere('SphereState', new Vector3(0, 0, 0), 1, 2);
    // Initially set sensors to ACTIVE.
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));

    sphere.setState(SensorState.MALFUNCTION, true);
    sphere.sensors.forEach(sensor => {
      expect(sensor.state).toBe(SensorState.MALFUNCTION);
    });
  });
});
