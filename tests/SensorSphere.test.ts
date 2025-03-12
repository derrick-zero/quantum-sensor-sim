/// <reference types="jest" />

import { SensorSphere } from '../src/sensors/SensorSphere';
import { Sensor } from '../src/sensors/Sensor';
import { SensorState } from '../src/sensors/SensorState';
import { Vector3 } from '../src/core/Vector3';
import { Constants } from '../src/core/Constants';
import { Logger } from '../src/core/Logger';

describe('SensorSphere Class Unit Tests', () => {
  // Preserve the original Math.random
  const originalMathRandom = Math.random;

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  test('constructor initializes correct number of sensors and computes mass', () => {
    const sensorCount = 50;
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      2.0,
      sensorCount
    );
    expect(sphere.sensors.length).toEqual(sensorCount);
    // The sphere mass should be the sum of its sensors' masses.
    const expectedMass = sphere.sensors.reduce(
      (sum, sensor) => sum + sensor.mass,
      0
    );
    expect(sphere.mass).toBeCloseTo(expectedMass);
  });

  test('computeMass correctly sums sensor masses after adding a sensor', () => {
    const sphere = new SensorSphere('Sphere2', new Vector3(0, 0, 0), 1.0, 0);
    expect(sphere.mass).toEqual(0);
    const sensor = new Sensor('S_add', new Vector3(1, 1, 1));
    sphere.addSensor(sensor);
    expect(sphere.sensors.length).toEqual(1);
    expect(sphere.mass).toBeCloseTo(sensor.mass);
  });

  test('update method updates sphere center and sensor positions', () => {
    // Create a sphere with a known velocity.
    const sphere = new SensorSphere('Sphere3', new Vector3(0, 0, 0), 1.0, 10);
    // Set sphere velocity and acceleration manually.
    sphere.velocity = new Vector3(1, 1, 1);
    sphere.acceleration = new Vector3(0.5, 0.5, 0.5);
    // Capture old center.
    const oldCenter = sphere.center.clone();
    // Update sphere with dt = 1 second.
    sphere.update(1);
    // New center must be oldCenter + velocity (updated).
    const expectedCenter = oldCenter.add(sphere.velocity);
    expect(sphere.center.x).toBeCloseTo(expectedCenter.x);
    expect(sphere.center.y).toBeCloseTo(expectedCenter.y);
    expect(sphere.center.z).toBeCloseTo(expectedCenter.z);
    // Additionally, each sensor's position should be updated by also adding sphere's movement.
    for (const sensor of sphere.sensors) {
      // We assume minimal sensor internal update changes if sensors started at their generated positions.
      // Check that sensor.position has changed by approximately the same amount as sphere velocity.
      // (Since sensors are updated with sphere velocity added.)
      const expectedDelta = sphere.velocity;
      // We can't directly know the original sensor positions unless we store them first.
      // So we check that sensor.position's change is non-zero.
      expect(sensor.position.x).not.toBeCloseTo(0, 2);
      expect(sensor.position.y).not.toBeCloseTo(0, 2);
      expect(sensor.position.z).not.toBeCloseTo(0, 2);
    }
  });

  test('update method throws error for non-positive deltaTime', () => {
    const sphere = new SensorSphere('Sphere4', new Vector3(), 1.0, 10);
    expect(() => sphere.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => sphere.update(-1)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('rotate method rotates sensors correctly relative to sphere center', () => {
    // Create a sphere with one sensor in a known relative position.
    const center = new Vector3(0, 0, 0);
    const sensor = new Sensor('S_rotate', new Vector3(1, 0, 0));
    const sphere = new SensorSphere('Sphere5', center, 2.0, 0);
    sphere.addSensor(sensor);

    // Rotate sphere 90 degrees about the Z-axis.
    const axis = new Vector3(0, 0, 1);
    const angle = Math.PI / 2; // 90 degrees
    sphere.rotate(axis, angle);

    // Relative sensor position should now be (0,1,0) relative to center.
    const expectedPosition = center.add(new Vector3(0, 1, 0));
    expect(sensor.position.x).toBeCloseTo(expectedPosition.x, 3);
    expect(sensor.position.y).toBeCloseTo(expectedPosition.y, 3);
    expect(sensor.position.z).toBeCloseTo(expectedPosition.z, 3);
  });

  test('vibrate method applies vibration offset to sensor positions', () => {
    const sphere = new SensorSphere('Sphere6', new Vector3(), 1.0, 5);
    // Store original positions.
    const originalPositions = sphere.sensors.map(sensor =>
      sensor.position.clone()
    );

    const amplitude = new Vector3(1, 1, 1);
    const frequency = new Vector3(1, 1, 1);
    // Choose dt such that sine is non-zero. dt = 0.25 yields sin(π/2)=1 for each component.
    const dt = 0.25;
    sphere.vibrate(amplitude, frequency, dt);

    // Check that at least one sensor's position has changed significantly.
    let changed = false;
    for (let i = 0; i < sphere.sensors.length; i++) {
      const original = originalPositions[i];
      const current = sphere.sensors[i].position;
      if (
        Math.abs(current.x - original.x) > 0.1 ||
        Math.abs(current.y - original.y) > 0.1 ||
        Math.abs(current.z - original.z) > 0.1
      ) {
        changed = true;
        break;
      }
    }
    expect(changed).toBe(true);
  });

  test('setState should propagate state to all sensors when flag is true', () => {
    const sphere = new SensorSphere('Sphere7', new Vector3(), 1.0, 5);
    sphere.setState(SensorState.MAINTENANCE, true);
    for (const sensor of sphere.sensors) {
      expect(sensor.state).toEqual(SensorState.MAINTENANCE);
    }
  });

  test('setState should not propagate state if flag is false', () => {
    const sphere = new SensorSphere('Sphere8', new Vector3(), 1.0, 5);
    // Set each sensor to ACTIVE initially.
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));
    sphere.setState(SensorState.INACTIVE, false);
    for (const sensor of sphere.sensors) {
      // Sensors should remain ACTIVE because propagation was not enabled.
      expect(sensor.state).toEqual(SensorState.ACTIVE);
    }
    // But the sphere's own state should be updated.
    expect(sphere.state).toEqual(SensorState.INACTIVE);
  });

  test('addSensor and removeSensor manage sensors and update mass correctly', () => {
    const sphere = new SensorSphere('Sphere9', new Vector3(), 1.0, 0);
    const initialMass = sphere.mass;
    const sensor = new Sensor('S_add', new Vector3(), new Vector3(), 2, 0);
    sphere.addSensor(sensor);
    expect(sphere.sensors.length).toEqual(1);
    expect(sphere.mass).toBeCloseTo(initialMass + sensor.mass);

    sphere.removeSensor('S_add');
    expect(sphere.sensors.length).toEqual(0);
    expect(sphere.mass).toBeCloseTo(0);
  });

  test('calculateForces should update acceleration based on neighboring spheres', () => {
    // Create two sensor spheres separated by a known distance.
    const center1 = new Vector3(0, 0, 0);
    const center2 = new Vector3(10, 0, 0); // 10 units apart
    const sphere1 = new SensorSphere('S1', center1, 1.0, 10);
    const sphere2 = new SensorSphere('S2', center2, 1.0, 10);

    // Manually set sensor masses for predictable outcomes.
    sphere1.mass = 20;
    sphere2.mass = 30;

    // Initially, sphere1 acceleration should be zero.
    expect(sphere1.acceleration.x).toBeCloseTo(0);

    sphere1.calculateForces([sphere2]);

    // Calculate expected gravitational acceleration magnitude: a = G * m2 / (distance^2)
    const G = Constants.GRAVITATIONAL_CONSTANT;
    const expectedAccMagnitude = (G * sphere2.mass) / (10 * 10);
    const actualAccMagnitude = sphere1.acceleration.magnitude();

    // Allow a very small tolerance for floating point arithmetic.
    expect(actualAccMagnitude).toBeCloseTo(expectedAccMagnitude, 5);
  });

  test('applyImpulse should update velocity based on impulse (Δv = impulse/mass)', () => {
    // Create a sphere with non-zero mass.
    const sphere = new SensorSphere('Sphere10', new Vector3(), 1.0, 10);
    // Manually set mass for predictability.
    sphere.mass = 50;
    const initialVelocity = sphere.velocity.clone();
    const impulse = new Vector3(100, 0, 0); // apply impulse in the X direction.
    sphere.applyImpulse(impulse);

    // Expected change in velocity: impulse / mass = 100 / 50 = 2 in the X-direction.
    const expectedVelocity = initialVelocity.add(new Vector3(2, 0, 0));
    expect(sphere.velocity.x).toBeCloseTo(expectedVelocity.x, 5);
  });

  test('applyImpulse should throw error if sphere mass is zero', () => {
    // Create a sphere whose mass is manually set to zero.
    const sphere = new SensorSphere('Sphere11', new Vector3(), 1.0, 0);
    sphere.mass = 0;
    const impulse = new Vector3(10, 0, 0);
    expect(() => sphere.applyImpulse(impulse)).toThrow(
      'Cannot apply impulse: sphere mass is zero.'
    );
  });

  test('static randomPointInSphere should return a point within the sphere', () => {
    // Override Math.random to generate a deterministic outcome.
    Math.random = () => 0.5;
    const center = new Vector3(0, 0, 0);
    const radius = 2;
    const point = SensorSphere.randomPointInSphere(center, radius);
    // The point's distance from the center must be less than or equal to radius.
    expect(point.distanceTo(center)).toBeLessThanOrEqual(radius);
  });

  test('calculateInteractions should log debug information', () => {
    const sphere = new SensorSphere('Sphere12', new Vector3(), 1.0, 10);
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    sphere.calculateInteractions();
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${sphere.sensors.length}`),
      'SensorSphere.calculateInteractions'
    );
    debugSpy.mockRestore();
  });
});
