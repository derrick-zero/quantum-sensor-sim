import { SensorSphere } from '../src/sensors/SensorSphere';
import { Sensor } from '../src/sensors/Sensor';
import { Vector3 } from '../src/core/Vector3';
import { SensorState } from '../src/sensors/SensorState';
import { Logger, LogLevel } from '../src/core/Logger';
import { SimulationEngine } from '../src/SimulationEngine';

// Create a TestSensorSphere subclass to control update behavior deterministically.
class TestSensorSphere extends SensorSphere {
  constructor(
    id: string,
    center: Vector3,
    radius: number = 1,
    sensorCount: number = 0
  ) {
    // Pass sensorCount = 0 so we can add sensors manually.
    super(id, center, radius, sensorCount);
  }

  // Override update to simply translate the center by (deltaTime, 0, 0).
  public update(deltaTime: number): void {
    this.center = this.center.add(new Vector3(deltaTime, 0, 0));
  }
}

describe('SensorSphere Tests', () => {
  test('Constructor initializes sensor sphere correctly', () => {
    const sensorCount = 10;
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1,
      sensorCount
    );
    // Validate sensor count
    expect(sphere.sensors.length).toBe(sensorCount);
    // Compute mass; assume each sensor has mass 1 (default from Sensor)
    sphere.computeMass();
    expect(sphere.mass).toBeCloseTo(sensorCount * 1, 5);
  });

  test('update method updates center and sensor positions', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(1, 1, 1), 1, 0);
    // Add sensors manually
    const sensor1 = new Sensor('S1', new Vector3(0, 0, 0));
    const sensor2 = new Sensor('S2', new Vector3(2, 2, 2));
    sphere.sensors.push(sensor1, sensor2);

    // Set sphere motion parameters.
    sphere.velocity = new Vector3(1, 0, 0);
    sphere.acceleration = new Vector3();

    const initialCenter = sphere.center.clone();
    const initialSensor1Pos = sensor1.position.clone();
    const initialSensor2Pos = sensor2.position.clone();

    sphere.update(2); // dt = 2 sec.

    // Expect sphere center to shift by (2, 0, 0)
    expect(sphere.center.x).toBeCloseTo(initialCenter.x + 2, 5);
    // Each sensor's position should also advance by (2, 0, 0) due to sphere translation.
    expect(sensor1.position.x).toBeCloseTo(initialSensor1Pos.x + 2, 5);
    expect(sensor2.position.x).toBeCloseTo(initialSensor2Pos.x + 2, 5);
  });

  test('update method throws error for non-positive deltaTime', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(1, 1, 1), 1, 0);
    expect(() => sphere.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => sphere.update(-1)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('computeNetworkCenter returns correct centroid of sensor centers', () => {
    // Use TestSensorSphere for controlled update.
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
    expect(centroid.x).toBeCloseTo(1, 5);
    expect(centroid.y).toBeCloseTo(0, 5);
    expect(centroid.z).toBeCloseTo(0, 5);
  });

  test('addSensor and removeSensor manage sensors within the sphere', () => {
    const networkSphere = new SensorSphere(
      'NetworkSphere',
      new Vector3(0, 0, 0),
      1,
      0
    );
    const sphere1 = new TestSensorSphere('S1', new Vector3(1, 1, 1));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 2, 2));
    // Cast for testing purposes.
    networkSphere.addSensor(sphere1 as unknown as Sensor);
    networkSphere.addSensor(sphere2 as unknown as Sensor);
    expect(networkSphere.sensors.length).toBe(2);
    networkSphere.removeSensor('S1');
    expect(networkSphere.sensors.length).toBe(1);
  });

  test('calculateInteractions logs expected debug message', () => {
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
    console.debug = jest.fn();
    const sphere = new SensorSphere('Sphere1', new Vector3(0, 0, 0), 1, 1);
    sphere.calculateInteractions();
    expect(console.debug).toHaveBeenCalled();
    const logMsg = (console.debug as jest.Mock).mock.calls[0][0];
    expect(logMsg).toEqual(
      expect.stringContaining(
        `Calculating interactions among ${sphere.sensors.length} sensors in sphere ${sphere.id}.`
      )
    );
    expect(logMsg).toEqual(
      expect.stringContaining('SensorSphere.calculateInteractions')
    );
  });

  test('vibrate method applies vibration offset to sensors', () => {
    const sphere = new SensorSphere(
      'SphereVibrate',
      new Vector3(0, 0, 0),
      1,
      1
    );
    const sensor = sphere.sensors[0];
    const initPos = sensor.position.clone();
    const amplitude = new Vector3(1, 1, 1);
    const frequency = new Vector3(1, 1, 1);
    const dt = 0.5;
    sphere.vibrate(amplitude, frequency, dt);
    expect(sensor.position.x).not.toEqual(initPos.x);
    expect(sensor.position.y).not.toEqual(initPos.y);
    expect(sensor.position.z).not.toEqual(initPos.z);
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
    expect(() =>
      sphere.rotate(null as unknown as Vector3, Math.PI / 2)
    ).toThrow('Axis and angle must be provided.');
    expect(() =>
      sphere.rotate(new Vector3(0, 1, 0), undefined as unknown as number)
    ).toThrow('Axis and angle must be provided.');
  });

  test('rotate method rotates sensors correctly', () => {
    const sphere = new SensorSphere('SphereRotate', new Vector3(0, 0, 0), 1, 1);
    const sensor = new Sensor('S1', new Vector3(1, 0, 0));
    sphere.sensors.push(sensor);
    sphere.rotate(new Vector3(0, 0, 1), Math.PI / 2);
    // Sensor should now be near (0,1,0) relative to sphere.center.
    expect(sensor.position.x).toBeCloseTo(0, 5);
    expect(sensor.position.y).toBeCloseTo(1, 5);
  });

  test('setState propagates state to all sensors when flag is true', () => {
    const sphere = new SensorSphere('SphereState', new Vector3(0, 0, 0), 1, 2);
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));
    sphere.setState(SensorState.MALFUNCTION, true);
    sphere.sensors.forEach(sensor => {
      expect(sensor.state).toBe(SensorState.MALFUNCTION);
    });
  });

  test('applyImpulse updates sphere velocity appropriately', () => {
    const sphere = new SensorSphere(
      'SphereImpulse',
      new Vector3(0, 0, 0),
      1,
      1
    );
    sphere.computeMass();
    const initVel = sphere.velocity.clone();
    sphere.applyImpulse(new Vector3(1, 0, 0));
    expect(sphere.velocity.x).not.toEqual(initVel.x);
  });

  // Test for container collision enforcement via SimulationEngine:
  test('handleContainerCollision properly repositions sensor outside container and reflects its velocity', () => {
    // Create a sensor positioned outside the container.
    const sensor = new Sensor(
      'S1',
      new Vector3(6, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    // Use default sensor radius (assume 0.2).
    const container = new SensorSphere(
      'Container',
      new Vector3(0, 0, 0),
      5,
      10
    );
    const engine = new SimulationEngine([sensor], [container], 0.1);

    engine.start();
    engine.update();
    engine.pause();

    // After update, sensor must be within container.
    const dist = sensor.position.distanceTo(container.center);
    expect(dist).toBeLessThanOrEqual(container.radius + 0.001);
    // Velocity should be reflected (if originally outward, x should reverse).
    expect(sensor.velocity.x).toBeLessThan(0);
  });
});
