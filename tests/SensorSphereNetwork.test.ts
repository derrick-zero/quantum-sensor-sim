import { SensorSphereNetwork } from '../src/sensors/SensorSphereNetwork';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { Vector3 } from '../src/core/Vector3';

// Create a test subclass of SensorSphere that minimizes initialization complexity
class TestSensorSphere extends SensorSphere {
  constructor(id: string, center: Vector3) {
    // Use a small sensorCount (e.g., 0) to avoid filling with sensors when testing network properties.
    super(id, center, 1.0, 0);
  }

  // Override update: for testing, simply increment the center's x coordinate by deltaTime.
  public update(deltaTime: number): void {
    this.center = this.center.add(new Vector3(deltaTime, 0, 0));
  }
}

describe('SensorSphereNetwork', () => {
  let network: SensorSphereNetwork;

  beforeEach(() => {
    network = new SensorSphereNetwork();
  });

  test('addSphere should add a sphere to the network', () => {
    const sphere = new TestSensorSphere('S1', new Vector3(1, 1, 1));
    network.addSphere(sphere);
    expect(network.spheres.length).toBe(1);
    expect(network.spheres[0].id).toBe('S1');
  });

  test('removeSphere should remove a sphere from the network', () => {
    const sphere1 = new TestSensorSphere('S1', new Vector3(1, 1, 1));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 2, 2));
    network.addSphere(sphere1);
    network.addSphere(sphere2);
    expect(network.spheres.length).toBe(2);
    network.removeSphere('S1');
    expect(network.spheres.length).toBe(1);
    expect(network.spheres[0].id).toBe('S2');
  });

  test('update should throw error on non-positive deltaTime', () => {
    expect(() => network.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('update should call update on each sensor sphere', () => {
    const sphere1 = new TestSensorSphere('S1', new Vector3(1, 0, 0));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 0, 0));
    network.addSphere(sphere1);
    network.addSphere(sphere2);

    const spy1 = jest.spyOn(sphere1, 'update');
    const spy2 = jest.spyOn(sphere2, 'update');

    network.update(1); // dt = 1 second
    expect(spy1).toHaveBeenCalledWith(1);
    expect(spy2).toHaveBeenCalledWith(1);
  });

  test('computeNetworkCenter should return the correct centroid', () => {
    const sphere1 = new TestSensorSphere('S1', new Vector3(0, 0, 0));
    const sphere2 = new TestSensorSphere('S2', new Vector3(2, 0, 0));
    network.addSphere(sphere1);
    network.addSphere(sphere2);

    const center = network.computeNetworkCenter();
    // Expected centroid: for points (0,0,0) and (2,0,0), the average is (1,0,0)
    expect(center.x).toBeCloseTo(1, 5);
    expect(center.y).toBeCloseTo(0, 5);
    expect(center.z).toBeCloseTo(0, 5);
  });
});
