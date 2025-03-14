/// <reference types="jest" />

import { expect } from '@jest/globals';
import { Sensor } from '../src/sensors/Sensor';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { SimulationEngine } from '../src/SimulationEngine';
import { SensorState } from '../src/sensors/SensorState';
import { Vector3 } from '../src/core/Vector3';
import { Logger } from '../src/core/Logger';
import { Constants } from '../src/core/Constants';

describe('SimulationEngine Tests', () => {
  beforeAll(() => {
    // Stub logging so that asynchronous log calls do nothing.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(Logger, 'debug').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    // If an engine instance is running, pause it after each test.
    const engine = (global as any).engine;
    if (engine && engine.running) {
      engine.pause();
    }
  });

  test('default fields: sensors and sensorSpheres are empty and deltaTime is default', () => {
    const engine = new SimulationEngine();
    // Expect sensors and sensorSpheres to be empty by default.
    expect((engine as any).sensors).toEqual([]);
    expect((engine as any).sensorSpheres).toEqual([]);
    // Delta time should equal Constants.DEFAULT_TIME_STEP.
    expect(engine.deltaTime).toEqual(Constants.DEFAULT_TIME_STEP);
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
    // In forward mode, globalTime increases by deltaTime.
    expect(engine.globalTime).toBeCloseTo(initialTime + 0.05, 5);
    engine.pause();
  });

  test('update method updates globalTime when running (reversed mode)', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.start();
    engine.toggleTimeReversal(); // switch to reversed mode.
    const initialTime = engine.globalTime;
    engine.update();
    // In reversed mode, globalTime decreases by deltaTime.
    expect(engine.globalTime).toBeCloseTo(initialTime - 0.05, 5);
    engine.pause();
  });

  test('update does nothing when engine is not running', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.pause(); // Ensure engine is not running.
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

  test('nested sensor sphere interactions: calculateForces is called for each pair', () => {
    // Create two sensor spheres.
    const sphere1 = new SensorSphere('Sphere1', new Vector3(0, 0, 0), 5, 10);
    const sphere2 = new SensorSphere('Sphere2', new Vector3(10, 0, 0), 5, 10);
    const engine = new SimulationEngine([], [sphere1, sphere2], 0.05);
    // Spy on calculateForces for each sphere.
    const spy1 = jest
      .spyOn(sphere1, 'calculateForces')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});
    const spy2 = jest
      .spyOn(sphere2, 'calculateForces')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});
    engine.start();
    engine.update();
    engine.pause();
    // Expect that for each unique pair, calculateForces is called on both.
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    spy1.mockRestore();
    spy2.mockRestore();
  });

  test('collision detection: sensors on a collision course update velocities', () => {
    // Create two sensors moving toward each other.
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

  test('collision detection: sensors overlapping and moving identically do not trigger collision response', () => {
    // Create two sensors with overlapping positions moving with identical velocities.
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

  test('handleSensorCollisions uses fallback for undefined sensor radius', () => {
    const sensor1 = new Sensor(
      'S_collision1',
      new Vector3(0, 0, 0),
      new Vector3(-1, 0, 0),
      1,
      1
    );
    const sensor2 = new Sensor(
      'S_collision2',
      new Vector3(0.3, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    // Remove the radius property to force the fallback.
    delete (sensor1 as any).radius;
    delete (sensor2 as any).radius;

    const engine = new SimulationEngine([sensor1, sensor2], [], 0.1);
    engine.start();
    expect(() => engine.update()).not.toThrow();
    engine.pause();
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
    // Create a sensor exactly at the container boundary.
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
    engine.start();
    engine.update();
    engine.pause();
    const currentPos = sensor.position.toArray();
    expect(currentPos[0]).toBeCloseTo(5, 1);
  });

  test('reset restores state and restarts simulation when resetAndRestart is true', () => {
    jest.useFakeTimers();
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
    engine.resetAndRestart = true;

    engine.start();
    engine.update();
    expect(engine.globalTime).toBeGreaterThan(0);

    // Modify state before reset.
    sensor.position = new Vector3(10, 10, 10);
    sphere.center = new Vector3(5, 5, 5);

    engine.reset(); // Revised reset() sets running=true synchronously.

    // Immediately after reset() returns, globalTime should be 0.
    expect(engine.globalTime).toEqual(0);
    // And the engine should be set to running.
    expect((engine as any).running).toEqual(true);

    // Flush pending timers so the simulation loop is restarted.
    jest.advanceTimersByTime(100);
    expect(engine.globalTime).toBeGreaterThan(0);

    engine.pause();
    jest.useRealTimers();
  });

  test('reset restores state and stops simulation when resetAndRestart is false', () => {
    jest.useFakeTimers();
    const sensor = new Sensor('S2', new Vector3(1, 1, 1));
    const sphere = new SensorSphere(
      'Sphere2',
      new Vector3(0, 0, 0),
      1.0,
      1,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor);
    const engine = new SimulationEngine([sensor], [sphere], 0.05);
    engine.resetAndRestart = false;

    engine.start();
    engine.update();
    expect(engine.globalTime).toBeGreaterThan(0);

    // Modify state.
    sensor.position = new Vector3(10, 10, 10);
    sphere.center = new Vector3(5, 5, 5);

    engine.reset();

    // Immediately after reset, globalTime should be 0.
    expect(engine.globalTime).toEqual(0);
    // Since resetAndRestart is false, running should be false.
    expect((engine as any).running).toEqual(false);

    // Flush pending timers (if any) and confirm globalTime remains 0.
    jest.advanceTimersByTime(100);
    expect(engine.globalTime).toEqual(0);

    jest.useRealTimers();
  });

  test('reset restores sensors and sensor spheres to their initial state and restarts simulation', () => {
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
    // Modify positions.
    sensor.position = new Vector3(10, 10, 10);
    sphere.center = new Vector3(5, 5, 5);
    engine.reset();
    expect(engine.globalTime).toEqual(0);
    const resetSensor = (engine as any).sensors[0];
    const resetSphere = (engine as any).sensorSpheres[0];
    expect(resetSensor.position.toArray()[0]).toBeCloseTo(1, 5);
    expect(resetSensor.position.toArray()[1]).toBeCloseTo(1, 5);
    expect(resetSensor.position.toArray()[2]).toBeCloseTo(1, 5);
    expect(resetSphere.center.toArray()[0]).toBeCloseTo(0, 5);
    expect(resetSphere.center.toArray()[1]).toBeCloseTo(0, 5);
    expect(resetSphere.center.toArray()[2]).toBeCloseTo(0, 5);
    expect((engine as any).running).toEqual(true);
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

  test('loop does not continue when engine is not running', () => {
    jest.useFakeTimers();
    const engine = new SimulationEngine([], [], 0.05);
    engine.pause(); // Ensure running is false.
    const updateSpy = jest.spyOn(engine, 'update');
    // Invoke the private loop() method using bracket notation.
    (engine as any).loop();
    // Advance timers to simulate passage of time.
    jest.advanceTimersByTime(100);
    // Since the engine is not running, update should never be called.
    expect(updateSpy).not.toHaveBeenCalled();
    updateSpy.mockRestore();
    jest.useRealTimers();
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

  test('toggleTimeReversal logs correct message', () => {
    const engine = new SimulationEngine([], [], 0.05);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const loggerSpy = jest.spyOn(Logger, 'info').mockImplementation(() => {});
    engine.toggleTimeReversal();
    expect(loggerSpy).toHaveBeenCalledWith(
      'Time reversal toggled. Now reversed.',
      'SimulationEngine.toggleTimeReversal'
    );
    loggerSpy.mockRestore();
  });

  test('toggleTimeReversal inverts velocities and logs correct message', () => {
    // Create a dummy sensor and sensor sphere.
    const sensor = new Sensor('S1', new Vector3(), new Vector3(1, 0, 0), 1, 0);
    const sphere = new SensorSphere(
      'Sphere1',
      new Vector3(),
      1,
      1,
      SensorState.ACTIVE
    );
    sphere.addSensor(sensor);
    const engine = new SimulationEngine([sensor], [sphere], 0.05);

    // Set initial velocities.
    sensor.velocity = new Vector3(1, 0, 0);
    sphere.velocity = new Vector3(2, 0, 0);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const loggerSpy = jest.spyOn(Logger, 'info').mockImplementation(() => {});
    engine.toggleTimeReversal();
    // Expect that the sensor and sphere velocities are negated.
    expect(sensor.velocity.x).toBeCloseTo(-1, 5);
    expect(sphere.velocity.x).toBeCloseTo(-2, 5);
    expect(loggerSpy).toHaveBeenCalledWith(
      'Time reversal toggled. Now reversed.',
      'SimulationEngine.toggleTimeReversal'
    );
    loggerSpy.mockRestore();
  });

  test('addSensor throws error when sensor is null or undefined', () => {
    const engine = new SimulationEngine([], [], 0.05);
    // @ts-expect-error: Testing error for null.
    expect(() => engine.addSensor(null)).toThrow(
      'Sensor cannot be null or undefined.'
    );
    // @ts-expect-error: Testing error for undefined.
    expect(() => engine.addSensor(undefined)).toThrow(
      'Sensor cannot be null or undefined.'
    );
  });

  test('addSensorSphere throws error when sensor sphere is null or undefined', () => {
    const engine = new SimulationEngine([], [], 0.05);
    // @ts-expect-error: Testing error for null.
    expect(() => engine.addSensorSphere(null)).toThrow(
      'SensorSphere cannot be null or undefined.'
    );
    // @ts-expect-error: Testing error for undefined.
    expect(() => engine.addSensorSphere(undefined)).toThrow(
      'SensorSphere cannot be null or undefined.'
    );
  });

  test('update throws error if deltaTime is non-positive', () => {
    const engine = new SimulationEngine([], [], 0.05);
    (engine as any).running = true;
    engine['deltaTime'] = 0;
    expect(() => engine.update()).toThrow(
      'Delta time must be greater than zero.'
    );
  });
});
