import { SimulationEngine } from '../src/SimulationEngine';
import { Sensor } from '../src/sensors/Sensor';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { Vector3 } from '../src/core/Vector3';
import { Logger, LogLevel } from '../src/core/Logger';

describe('SimulationEngine Tests', () => {
  beforeAll(() => {
    // Set Logger to DEBUG for testing updates.
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
    // Assume update advances time by deltaTime (0.05 seconds)
    expect(engine.globalTime).toBeCloseTo(initialTime + 0.05, 5);
    engine.pause();
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
});
