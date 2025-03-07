import { SimulationEngine } from '../src/SimulationEngine';
import { Sensor } from '../src/sensors/Sensor';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { Vector3 } from '../src/core/Vector3';
import { Logger, LogLevel } from '../src/core/Logger';

describe('SimulationEngine Tests', () => {
  beforeAll(() => {
    // Configure Logger for debugging.
    Logger.configure({ level: LogLevel.DEBUG, logToFile: false });
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

  test('update method updates globalTime when running', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.start();
    const initialTime = engine.globalTime;
    engine.update();
    // Expect globalTime to advance by 0.05 seconds.
    expect(engine.globalTime).toBeCloseTo(initialTime + 0.05, 5);
    engine.pause();
  });

  test('update does nothing when engine is not running', () => {
    const engine = new SimulationEngine([], [], 0.05);
    const initialTime = engine.globalTime;
    engine.update();
    // Since engine is not running, globalTime should not change.
    expect(engine.globalTime).toBe(initialTime);
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
    // Create two sensors set up to collide.
    const sensor1 = new Sensor(
      'S1',
      new Vector3(-0.3, 0, 0),
      new Vector3(),
      1,
      1
    );
    const sensor2 = new Sensor(
      'S2',
      new Vector3(0.3, 0, 0),
      new Vector3(),
      1,
      1
    );
    (sensor1 as any).radius = 0.5;
    (sensor2 as any).radius = 0.5;

    // Set velocities toward each other.
    sensor1.velocity = new Vector3(-1, 0, 0);
    sensor2.velocity = new Vector3(1, 0, 0);

    const engine = new SimulationEngine([sensor1, sensor2], [], 0.1);
    const initialV1 = sensor1.velocity.clone();
    const initialV2 = sensor2.velocity.clone();

    engine.start();
    engine.update();
    engine.pause();

    expect(sensor1.velocity.x).not.toEqual(initialV1.x);
    expect(sensor2.velocity.x).not.toEqual(initialV2.x);
  });

  test('collision detection: sensors moving apart do not trigger collision response', () => {
    // Create two sensors that are close but moving in the same direction.
    const sensor1 = new Sensor(
      'S1',
      new Vector3(-0.3, 0, 0),
      new Vector3(),
      1,
      1
    );
    const sensor2 = new Sensor(
      'S2',
      new Vector3(0.3, 0, 0),
      new Vector3(),
      1,
      1
    );
    (sensor1 as any).radius = 0.5;
    (sensor2 as any).radius = 0.5;

    // Both sensors moving upward.
    sensor1.velocity = new Vector3(0, 1, 0);
    sensor2.velocity = new Vector3(0, 1, 0);

    const engine = new SimulationEngine([sensor1, sensor2], [], 0.1);
    const initialV1 = sensor1.velocity.clone();
    const initialV2 = sensor2.velocity.clone();

    engine.start();
    engine.update();
    engine.pause();

    expect(sensor1.velocity.x).toEqual(initialV1.x);
    expect(sensor1.velocity.y).toEqual(initialV1.y);
    expect(sensor2.velocity.x).toEqual(initialV2.x);
    expect(sensor2.velocity.y).toEqual(initialV2.y);
  });

  test('handleContainerCollision: sensor outside container is repositioned and velocity reflected', () => {
    // Create a sensor outside the container boundary.
    const sensor = new Sensor(
      'S1',
      new Vector3(6, 0, 0),
      new Vector3(1, 0, 0),
      1,
      1
    );
    (sensor as any).radius = 0.2;
    // Create a container sensor sphere with center at origin and radius 5.
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

    // Sensor should be repositioned within the container boundary.
    const distance = sensor.position.distanceTo(container.center);
    expect(distance).toBeLessThanOrEqual(container.radius + 0.001);
    // Expect the velocity to be reflected (if originally moving outward, x should be reversed).
    expect(sensor.velocity.x).toBeLessThan(0);
  });

  test('reset method resets globalTime and sensor states', () => {
    const sensor = new Sensor('S1', new Vector3(1, 1, 1));
    const engine = new SimulationEngine([sensor], [], 0.05);
    engine.start();
    engine.update();
    expect(engine.globalTime).toBeGreaterThan(0);

    engine.reset();
    expect(engine.globalTime).toBe(0);
    const resetSensor = (engine as any).sensors[0];
    expect(resetSensor.position.x).toBeCloseTo(1, 5);
    expect(resetSensor.position.y).toBeCloseTo(1, 5);
    expect(resetSensor.position.z).toBeCloseTo(1, 5);
    engine.pause();
  });

  test('randomize method randomizes sensor positions and velocities', () => {
    const sensor = new Sensor('S1', new Vector3(0, 0, 0), new Vector3());
    const engine = new SimulationEngine([sensor], [], 0.05);
    const origPos = sensor.position.clone();
    const origVel = sensor.velocity.clone();

    engine.randomize();

    expect(sensor.position.x).not.toEqual(origPos.x);
    expect(sensor.velocity.x).not.toEqual(origVel.x);
  });

  test('toggleTimeReversal reverses simulation time progression', () => {
    const engine = new SimulationEngine([], [], 0.05);
    engine.start();
    const initialTime = engine.globalTime;
    engine.update();
    expect(engine.globalTime).toBeCloseTo(initialTime + 0.05, 5);

    engine.toggleTimeReversal();
    engine.update();
    expect(engine.globalTime).toBeCloseTo(initialTime, 5);
    engine.pause();
  });
});
