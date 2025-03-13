/// <reference types="jest" />

import { SensorSphereNetwork } from '../src/sensors/SensorSphereNetwork';
import { SensorSphere } from '../src/sensors/SensorSphere';
// import { Sensor } from '../src/sensors/Sensor';
import { SensorState } from '../src/sensors/SensorState';
import { Vector3 } from '../src/core/Vector3';
// import { Constants } from '../src/core/Constants';
import { Logger } from '../src/core/Logger';

describe('SensorSphereNetwork Class Unit Tests', () => {
  test('constructor initializes empty network if no spheres provided', () => {
    const network = new SensorSphereNetwork();
    expect(network.spheres).toEqual([]);
  });

  test('addSphere properly adds a sphere to the network', () => {
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const network = new SensorSphereNetwork();
    network.addSphere(sphere);
    expect(network.spheres.length).toEqual(1);
    expect(network.spheres[0]).toBe(sphere);
  });

  test('removeSphere properly removes a sphere from the network', () => {
    const sphere1 = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const sphere2 = new SensorSphere(
      'Sphere2',
      new Vector3(10, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const network = new SensorSphereNetwork([sphere1, sphere2]);
    network.removeSphere('Sphere1');
    expect(network.spheres.length).toEqual(1);
    expect(network.spheres[0].id).toBe('Sphere2');
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
    const network = new SensorSphereNetwork([sphere]);
    network.update(1);
    expect(updateSpy).toHaveBeenCalledWith(1);
    expect(() => network.update(0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => network.update(-1)).toThrow(
      'Delta time must be greater than zero.'
    );
    updateSpy.mockRestore();
  });

  test('computeNetworkMass returns the total mass of the network', () => {
    const sphere1 = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const sphere2 = new SensorSphere(
      'Sphere2',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    // Manually set masses for predictable results.
    sphere1.mass = 20;
    sphere2.mass = 30;
    const network = new SensorSphereNetwork([sphere1, sphere2]);
    expect(network.computeNetworkMass()).toBeCloseTo(50);
  });

  test('setState propagates state to all sensor spheres and their sensors when flag is true', () => {
    const sphere1 = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1.0,
      5,
      SensorState.ACTIVE
    );
    const sphere2 = new SensorSphere(
      'Sphere2',
      new Vector3(),
      1.0,
      5,
      SensorState.ACTIVE
    );
    const network = new SensorSphereNetwork([sphere1, sphere2]);
    network.setState(SensorState.MAINTENANCE, true);
    for (const sphere of network.spheres) {
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
    const network = new SensorSphereNetwork([sphere]);
    // Initially set all sensors to ACTIVE
    sphere.sensors.forEach(sensor => sensor.setState(SensorState.ACTIVE));
    network.setState(SensorState.INACTIVE, false);
    expect(sphere.state).toEqual(SensorState.INACTIVE);
    sphere.sensors.forEach(sensor => {
      expect(sensor.state).toEqual(SensorState.ACTIVE);
    });
  });

  test('calculateInteractions logs debug information for each sensor sphere pair', () => {
    const sphere1 = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const sphere2 = new SensorSphere(
      'Sphere2',
      new Vector3(5, 0, 0),
      1.0,
      10,
      SensorState.ACTIVE
    );
    const network = new SensorSphereNetwork([sphere1, sphere2]);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(Logger, 'debug').mockImplementation(() => {});
    network.calculateInteractions();
    // Adjust expectation to look for "Calculating interaction" (singular) in the message.
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Calculating interaction'),
      'SensorSphereNetwork.calculateInteractions'
    );
    debugSpy.mockRestore();
  });
});
