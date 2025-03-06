import { SimulationEngine } from '../src/SimulationEngine';
import { Sensor } from '../src/sensors/Sensor';
import { SensorSphere } from '../src/sensors/SensorSphere';
import { Vector3 } from '../src/core/Vector3';
import { Logger, LogLevel } from '../src/core/Logger';

describe('SimulationEngine Tests', () => {
  beforeAll(() => {
    // Set logger to debug for testing.
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

  test('addSensor and addSensorSphere work correctly', () => {
    const engine = new SimulationEngine([], [], 0.05);
    const sensor = new Sensor('S1', new Vector3(0, 0, 0));
    const sphere = new SensorSphere('Sphere1', new Vector3(1, 1, 1), 1, 5);
    engine.addSensor(sensor);
    engine.addSensorSphere(sphere);
    // Use type assertions if needed.
    expect((engine as any).sensors.length).toBeGreaterThan(0);
    expect((engine as any).sensorSpheres.length).toBeGreaterThan(0);
  });
});
