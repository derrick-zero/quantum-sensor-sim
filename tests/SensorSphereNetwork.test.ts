/// <reference types="jest" />

import { expect } from '@jest/globals';
import { SensorSphereNetwork } from '../src/sensors/SensorSphereNetwork';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { SensorState } from '../src/sensors/SensorState';
import { SimulationEngine } from '../src/SimulationEngine';
import { Vector3 } from '../src/core/Vector3';
import { Logger } from '../src/core/Logger';

describe('SensorSphereNetwork Class Unit Tests', () => {
  let network: SensorSphereNetwork;
  let sphere1: SensorSphere;
  let sphere2: SensorSphere;

  beforeEach(() => {
    network = new SensorSphereNetwork();
    sphere1 = new SensorSphere('Sphere1', new Vector3(0, 0, 0), 5, 10);
    sphere2 = new SensorSphere('Sphere2', new Vector3(10, 0, 0), 5, 10);
    network.addSphere(sphere1);
    network.addSphere(sphere2);
  });

  test('constructor initializes empty network if no spheres provided', () => {
    const emptyNetwork = new SensorSphereNetwork();
    // Use getter if available; otherwise, assume spheres property is public.
    expect(emptyNetwork.getSpheres()).toEqual([]);
  });

  test('should add and remove sensor spheres correctly', () => {
    expect(network.getSpheres().length).toEqual(2);
    network.removeSphere('Sphere1');
    expect(network.getSpheres().length).toEqual(1);
    expect(network.getSpheres()[0].id).toEqual('Sphere2');
  });

  test('should update inter-sphere interactions for spheres with sufficient separation', () => {
    // Reset accelerations.
    sphere1.acceleration = Vector3.zero();
    sphere2.acceleration = Vector3.zero();
    network.updateInteractions(0.05);
    // Expect both spheres to have non-zero acceleration.
    expect(sphere1.acceleration.magnitude()).toBeGreaterThan(0);
    expect(sphere2.acceleration.magnitude()).toBeGreaterThan(0);
  });

  test('should not update inter-sphere interactions if spheres are extremely close', () => {
    // Create two spheres with nearly identical centers.
    const sphereA = new SensorSphere('SphereA', new Vector3(0, 0, 0), 1.0, 10);
    const sphereB = new SensorSphere(
      'SphereB',
      new Vector3(0.0005, 0, 0),
      1.0,
      10
    );
    sphereA.acceleration = Vector3.zero();
    sphereB.acceleration = Vector3.zero();
    const closeNetwork = new SensorSphereNetwork();
    closeNetwork.addSphere(sphereA);
    closeNetwork.addSphere(sphereB);
    closeNetwork.updateInteractions(0.05);
    // Expect that no interaction is applied if distance is too small.
    expect(sphereA.acceleration.magnitude()).toEqual(0);
    expect(sphereB.acceleration.magnitude()).toEqual(0);
  });

  test('update calls update on each sphere and throws error for non-positive deltaTime', () => {
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const updateSpy = jest.spyOn(sphere, 'update');
    const singleNetwork = new SensorSphereNetwork();
    singleNetwork.addSphere(sphere);
    singleNetwork.update(1);
    expect(updateSpy).toHaveBeenCalledWith(1);
    expect(() => singleNetwork.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => singleNetwork.update(-1)).toThrow(
      'Delta time must be greater than zero.'
    );
    updateSpy.mockRestore();
  });

  test('computeNetworkMass returns the total mass of the network', () => {
    const sphereA = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const sphereB = new SensorSphere(
      'Sphere2',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    // Manually set masses for predictable results.
    sphereA.mass = 20;
    sphereB.mass = 30;
    const massNetwork = new SensorSphereNetwork();
    massNetwork.addSphere(sphereA);
    massNetwork.addSphere(sphereB);
    expect(massNetwork.computeNetworkMass()).toBeCloseTo(50);
  });

  test('computeNetworkMass returns 0 when network has no spheres', () => {
    const emptyNetwork = new SensorSphereNetwork();
    expect(emptyNetwork.computeNetworkMass()).toEqual(0);
  });

  test('setState propagates state to all sensor spheres and their sensors when flag is true', () => {
    const sphereA = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      5,
      SensorState.ACTIVE
    );
    const sphereB = new SensorSphere(
      'Sphere2',
      new Vector3(),
      1.0,
      5,
      SensorState.ACTIVE
    );
    const networkWithSpheres = new SensorSphereNetwork();
    networkWithSpheres.addSphere(sphereA);
    networkWithSpheres.addSphere(sphereB);
    networkWithSpheres.setState(SensorState.MAINTENANCE, true);
    for (const sphere of networkWithSpheres.getSpheres()) {
      expect(sphere.state).toEqual(SensorState.MAINTENANCE);
      sphere.sensors.forEach(sensor => {
        expect(sensor.state).toEqual(SensorState.MAINTENANCE);
      });
    }
  });

  test('setState does not propagate state if flag is false', () => {
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      5,
      SensorState.ACTIVE
    );
    const networkForState = new SensorSphereNetwork();
    networkForState.addSphere(sphere);
    // Initially set all sensors to ACTIVE.
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));
    networkForState.setState(SensorState.INACTIVE, false);
    expect(sphere.state).toEqual(SensorState.INACTIVE);
    sphere.sensors.forEach(sensor => {
      expect(sensor.state).toEqual(SensorState.ACTIVE);
    });
  });

  test('setState on empty network does not throw', () => {
    const emptyNetwork = new SensorSphereNetwork();
    expect(() =>
      emptyNetwork.setState(SensorState.INACTIVE, true)
    ).not.toThrow();
  });

  test('calculateInteractions logs debug information for each sensor sphere pair when multiple spheres exist', () => {
    const sphereA = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const sphereB = new SensorSphere(
      'Sphere2',
      new Vector3(5, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const multiNetwork = new SensorSphereNetwork();
    multiNetwork.addSphere(sphereA);
    multiNetwork.addSphere(sphereB);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    multiNetwork.calculateInteractions();
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Calculating interaction between'),
      'SensorSphereNetwork.calculateInteractions'
    );
    debugSpy.mockRestore();
  });

  test('calculateInteractions does not log interactions when only one sphere exists', () => {
    const singleSphere = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const singleNetwork = new SensorSphereNetwork();
    singleNetwork.addSphere(singleSphere);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    singleNetwork.calculateInteractions();
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  test('should throw an error when adding a null sensor sphere', () => {
    const engine = new SimulationEngine([], [], 0.05);
    // Intentionally pass null to trigger the error.
    // @ts-expect-error: testing error for null sensor sphere.
    expect(() => engine.addSensorSphere(null)).toThrow(
      'SensorSphere cannot be null or undefined.'
    );
  });

  test('should throw an error when adding an undefined sensor sphere', () => {
    const engine = new SimulationEngine([], [], 0.05);
    // Intentionally pass undefined to trigger the error.
    // @ts-expect-error: testing error for undefined sensor sphere.
    expect(() => engine.addSensorSphere(undefined)).toThrow(
      'SensorSphere cannot be null or undefined.'
    );
  });
});
