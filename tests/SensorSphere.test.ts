/// <reference types="jest" />

import { expect } from '@jest/globals';
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

  // Constructor Tests
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

  test('Default SensorSphere constructor parameters assign correct values', () => {
    // Create a SensorSphere with just an id.
    const sphere = new SensorSphere('DefaultSphere');
    // Default center: (0,0,0)
    expect(sphere.center).toEqual(new Vector3(0, 0, 0));
    // Default radius is 1.0.
    expect(sphere.radius).toEqual(1.0);
    // Default sensorCount is 100, so 100 sensors are generated.
    expect(sphere.sensors.length).toEqual(100);
  });

  test('Default SensorSphere generates sensors with neutral color, and sphere color is neutral', () => {
    // Force Math.random() to return 0 so that every sensor gets a neutral charge.
    Math.random = () => 0;
    const sphere = new SensorSphere('DefaultSphere', new Vector3(), 5, 20);
    sphere.sensors.forEach(sensor => {
      expect(sensor.color).toEqual('#FFFFFF');
    });
    // The sphere’s own color is computed from the average sensor charge (0), so it should be neutral.
    expect(sphere.color).toEqual('#FFFFFF');
  });

  // Method Tests
  test('computeMass correctly sums sensor masses after adding a sensor', () => {
    const sphere = new SensorSphere('Sphere2', new Vector3(0, 0, 0), 1.0, 0);
    expect(sphere.mass).toEqual(0);
    const sensor = new Sensor('S_add', new Vector3(1, 1, 1));
    sphere.addSensor(sensor);
    expect(sphere.sensors.length).toEqual(1);
    expect(sphere.mass).toBeCloseTo(sensor.mass);
  });

  test('SensorSphere color is computed correctly for all positive sensors', () => {
    // Create an empty sphere (sensorCount set to 0).
    const sphere = new SensorSphere(
      'PosSphere',
      new Vector3(),
      5,
      0,
      SensorState.ACTIVE
    );
    // Manually add sensors with charge 5.
    const sensor1 = new Sensor(
      'Pos1',
      new Vector3(),
      Vector3.zero(),
      1,
      5,
      SensorState.ACTIVE
    );
    const sensor2 = new Sensor(
      'Pos2',
      new Vector3(),
      Vector3.zero(),
      1,
      5,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor1);
    sphere.addSensor(sensor2);
    // Average charge = (5 + 5)/2 = 5. Normalized = 0.5, expected hue = 30 - (30*0.5) = 15.
    const expectedColor = 'hsl(15, 100%, 50%)';
    sphere.computeMass();
    // Force an update cycle to refresh sphere's color.
    sphere.update(0.1);
    expect(sphere.color).toEqual(expectedColor);
  });

  test('SensorSphere color is computed correctly for all negative sensors', () => {
    const sphere = new SensorSphere(
      'NegSphere',
      new Vector3(),
      5,
      0,
      SensorState.ACTIVE
    );
    const sensor1 = new Sensor(
      'Neg1',
      new Vector3(),
      Vector3.zero(),
      1,
      -5,
      SensorState.ACTIVE
    );
    const sensor2 = new Sensor(
      'Neg2',
      new Vector3(),
      Vector3.zero(),
      1,
      -5,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor1);
    sphere.addSensor(sensor2);
    // Average charge = (-5 + -5) / 2 = -5, normalized = 0.5, expected hue = 180 + (60*0.5) = 210.
    const expectedColor = 'hsl(210, 100%, 50%)';
    sphere.computeMass();
    sphere.update(0.1);
    expect(sphere.color).toEqual(expectedColor);
  });

  test('SensorSphere color is computed correctly for mixed sensor charges', () => {
    const sphere = new SensorSphere(
      'MixedSphere',
      new Vector3(),
      5,
      0,
      SensorState.ACTIVE
    );
    // Add one sensor with +5, one with -3.
    const sensor1 = new Sensor(
      'Mixed1',
      new Vector3(),
      Vector3.zero(),
      1,
      5,
      SensorState.ACTIVE
    );
    const sensor2 = new Sensor(
      'Mixed2',
      new Vector3(),
      Vector3.zero(),
      1,
      -3,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor1);
    sphere.addSensor(sensor2);
    // Average charge = (5 + (-3)) / 2 = 1. Normalized = 1/10 = 0.1 → Positive mapping: hue = 30 - (30*0.1) = 27.
    const expectedColor = 'hsl(27, 100%, 50%)';
    sphere.computeMass();
    sphere.update(0.1);
    expect(sphere.color).toEqual(expectedColor);
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

  test('setState defaults propagateToSensors to true', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(), 5, 5);
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));
    sphere.setState(SensorState.INACTIVE);
    expect(sphere.state).toEqual(SensorState.INACTIVE);
    sphere.sensors.forEach(sensor => {
      expect(sensor.state).toEqual(SensorState.INACTIVE);
    });
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    sphere.calculateInteractions();
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining(`${sphere.sensors.length}`),
      'SensorSphere.calculateInteractions'
    );
    debugSpy.mockRestore();
  });

  // Error Handling Tests
  test('addSensor throws error when sensor is null or undefined', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(), 5, 10);
    // Test with null.
    expect(() => {
      sphere.addSensor(null as any);
    }).toThrow('Sensor cannot be null or undefined.');
    // Test with undefined.
    expect(() => {
      sphere.addSensor(undefined as any);
    }).toThrow('Sensor cannot be null or undefined.');
  });

  test('rotate() throws error when axis is null or angle is undefined', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(), 5, 5);
    expect(() => sphere.rotate(null as any, Math.PI / 2)).toThrow(
      'Axis and angle must be provided.'
    );
    expect(() => sphere.rotate(new Vector3(1, 0, 0), undefined as any)).toThrow(
      'Axis and angle must be provided.'
    );
  });

  test('vibrate() throws error when amplitude, frequency, or deltaTime is invalid', () => {
    const sphere = new SensorSphere('TestSphere', new Vector3(), 5, 5);
    expect(() =>
      sphere.vibrate(null as any, new Vector3(1, 1, 1), 0.1)
    ).toThrow('Amplitude, frequency, and deltaTime must be valid.');
    expect(() =>
      sphere.vibrate(new Vector3(1, 1, 1), null as any, 0.1)
    ).toThrow('Amplitude, frequency, and deltaTime must be valid.');
    expect(() =>
      sphere.vibrate(new Vector3(1, 1, 1), new Vector3(1, 1, 1), 0)
    ).toThrow('Amplitude, frequency, and deltaTime must be valid.');
  });
});
