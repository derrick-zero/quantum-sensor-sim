/// <reference types="jest" />

import { Sensor } from '../src/sensors/Sensor';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { SimulationEngine } from '../src/SimulationEngine';
import { SensorState } from '../src/sensors/SensorState';
import { Vector3 } from '../src/core/Vector3';
import { Logger, LogLevel } from '../src/core/Logger';
import { Constants } from '../src/core/Constants';

describe('SimulationEngine Tests', () => {
  beforeAll(() => {
    // Configure Logger for debugging.
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
  });

  test('constructor throws error when deltaTime is non-positive', () => {
    expect(() => new SimulationEngine([], [], 0)).toThrow(
      'Delta time must be greater than zero.'
    );
    expect(() => new SimulationEngine([], [], -0.01)).toThrow(
      'Delta time must be greater than zero.'
    );
  });

  test('start and globalTime advance', done => {
    const engine = new SimulationEngine([], [], 0.05);
    const initialTime = engine.globalTime;
    engine.start();
    setTimeout(() => {
      engine.pause();
      expect(engine.globalTime).toBeGreaterThan(initialTime);
      done();
    }, 150);
  });

  test('update method updates globalTime when running (forward mode)', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.start();
    const initialTime = engine.globalTime;
    engine.update();
    expect(engine.globalTime).toBeCloseTo(initialTime + 0.05, 5);
    engine.pause();
  });

  test('update method updates globalTime when running (reversed mode)', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.start();
    engine.toggleTimeReversal();
    const initialTime = engine.globalTime;
    engine.update();
    expect(engine.globalTime).toBeCloseTo(initialTime - 0.05, 5);
    engine.pause();
  });

  test('update does nothing when engine is not running', () => {
    const engine = new SimulationEngine([], [], 0.05);
    const initialTime = engine.globalTime;
    engine.update();
    expect(engine.globalTime).toEqual(initialTime);
  });

  test('addSensor and addSensorSphere work correctly', () => {
    const engine = new SimulationEngine([], [], 0.05);
    const sensor = new Sensor('S1', new Vector3(0, 0, 0));
    const sphere = new SensorSphere('Sphere1', new Vector3(1, 1, 1), 1, 5);
    engine.addSensor(sensor);
    engine.addSensorSphere(sphere);
    expect((engine as any).sensors.length).toBeGreaterThan(0);
    expect((engine as any).sensorSpheres.length).toBeGreaterThan(0);
  });

  test('collision detection: sensors on a collision course update velocities', () => {
    const sensor1 = new Sensor(
      'S1',
      new Vector3(-0.3, 0, 0),
      new Vector3(-1, 0, 0),
      1,
      1
    );
    const sensor2 = new Sensor(
      'S2',
      new Vector3(0.3, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    (sensor1 as any).radius = 0.5;
    (sensor2 as any).radius = 0.5;
    const engine = new SimulationEngine([sensor1, sensor2], [], 0.1);
    const originalV1 = sensor1.velocity.clone();
    const originalV2 = sensor2.velocity.clone();
    engine.start();
    engine.update();
    engine.pause();
    expect(sensor1.velocity.x).not.toEqual(originalV1.x);
    expect(sensor2.velocity.x).not.toEqual(originalV2.x);
  });

  test('collision detection: sensors overlapping with zero relative velocity do not trigger collision response', () => {
    const sensor1 = new Sensor(
      'S_overlap1',
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    const sensor2 = new Sensor(
      'S_overlap2',
      new Vector3(0.2, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    (sensor1 as any).radius = 0.5;
    (sensor2 as any).radius = 0.5;
    const engine = new SimulationEngine([sensor1, sensor2], [], 0.1);
    const originalV1 = sensor1.velocity.clone();
    const originalV2 = sensor2.velocity.clone();
    engine.start();
    engine.update();
    engine.pause();
    expect(sensor1.velocity.x).toEqual(originalV1.x);
    expect(sensor2.velocity.x).toEqual(originalV2.x);
  });

  test('handleContainerCollision: sensor outside container is repositioned and velocity reflected', () => {
    const sensor = new Sensor(
      'S_container1',
      new Vector3(6, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    (sensor as any).radius = 0.2;
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
    const distance = sensor.position.distanceTo(container.center);
    expect(distance).toBeLessThanOrEqual(container.radius + 0.001);
    expect(sensor.velocity.x).toBeLessThan(0);
  });

  test('handleContainerCollision: sensor exactly on boundary remains unchanged', () => {
    // Create a sensor exactly at (5,0,0) with zero velocity to ensure it does not trigger repositioning.
    const sensor = new Sensor(
      'S_boundary',
      new Vector3(5, 0, 0),
      Vector3.zero(),
      1,
      1
    );
    (sensor as any).radius = 0.2;
    const container = new SensorSphere(
      'Container',
      new Vector3(0, 0, 0),
      5,
      10
    );
    const engine = new SimulationEngine([sensor], [container], 0.1);
    // Set engine running to force collision check.
    engine.start();
    engine.update();
    engine.pause();
    // Expect sensor.position.x to remain close to 5, within a tolerance.
    expect(sensor.position.x).toBeCloseTo(5, 1);
  });

  test('reset restores sensors and sensor spheres to their initial state', () => {
    const sensor = new Sensor('S1', new Vector3(1, 1, 1));
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(0, 0, 0),
      1.0,
      1,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor);
    const engine = new SimulationEngine([sensor], [sphere], 0.05);
    engine.start();
    engine.update();
    expect(engine.globalTime).toBeGreaterThan(0);
    // Modify sensor and sphere positions.
    sensor.position = new Vector3(10, 10, 10);
    sphere.center = new Vector3(5, 5, 5);
    engine.reset();
    expect(engine.globalTime).toEqual(0);
    const resetSensor = (engine as any).sensors[0];
    const resetSphere = (engine as any).sensorSpheres[0];
    expect(resetSensor.position.x).toBeCloseTo(1, 5);
    expect(resetSensor.position.y).toBeCloseTo(1, 5);
    expect(resetSensor.position.z).toBeCloseTo(1, 5);
    expect(resetSphere.center.x).toBeCloseTo(0, 5);
    expect(resetSphere.center.y).toBeCloseTo(0, 5);
    expect(resetSphere.center.z).toBeCloseTo(0, 5);
    engine.pause();
  });

  test('randomize method randomizes sensor positions and velocities', () => {
    const sensor = new Sensor('S_random', new Vector3(0, 0, 0), new Vector3());
    const engine = new SimulationEngine([sensor], [], 0.05);
    const origPos = sensor.position.clone();
    const origVel = sensor.velocity.clone();
    engine.randomize();
    expect(sensor.position.x).not.toEqual(origPos.x);
    expect(sensor.velocity.x).not.toEqual(origVel.x);
  });

  test('toggleTimeReversal reverses velocities for sensors and sensor spheres', () => {
    const sensor = new Sensor('S9', new Vector3(), new Vector3(1, 0, 0), 1, 0);
    const sphere = new SensorSphere(
      'Sphere2',
      new Vector3(),
      1.0,
      10,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor);
    const engine = new SimulationEngine([sensor], [sphere], 0.05);
    sensor.velocity = new Vector3(1, 0, 0);
    sphere.velocity = new Vector3(2, 0, 0);
    engine.toggleTimeReversal();
    expect(sensor.velocity.x).toBeCloseTo(-1, 5);
    expect(sphere.velocity.x).toBeCloseTo(-2, 5);
  });

  test('update throws error if deltaTime is non-positive', () => {
    const engine = new SimulationEngine([], [], 0.05);
    (engine as any).running = true;
    // Manually force deltaTime to zero.
    engine['deltaTime'] = 0;
    expect(() => engine.update()).toThrow(
      'Delta time must be greater than zero.'
    );
  });
});
