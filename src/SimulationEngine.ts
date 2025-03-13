import { Sensor } from './sensors/Sensor';
import { SensorSphere } from './sensors/SensorSphere';
import { Logger } from './core/Logger';
import { Constants } from './core/Constants';
import { Vector3 } from './core/Vector3';

/**
 * SimulationEngine orchestrates the simulation by updating sensors and sensor spheres,
 * processing physics interactions, handling collisions, and enforcing container boundaries.
 * It supports starting, pausing, resetting, randomizing, and toggling time reversal.
 */
export class SimulationEngine {
  private sensors: Sensor[];
  private sensorSpheres: SensorSphere[];
  public deltaTime: number; // Time step in seconds.
  private running: boolean;
  public globalTime: number;
  private timeReversed: boolean;

  private initialSensorsState: Sensor[];
  private initialSensorSpheresState: SensorSphere[];

  public container: SensorSphere | null;

  constructor(
    sensors: Sensor[] = [],
    sensorSpheres: SensorSphere[] = [],
    deltaTime: number = Constants.DEFAULT_TIME_STEP
  ) {
    if (deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }
    this.sensors = sensors;
    this.sensorSpheres = sensorSpheres;
    this.deltaTime = deltaTime;
    this.globalTime = 0;
    this.running = false;
    this.timeReversed = false;
    this.container = sensorSpheres.length > 0 ? sensorSpheres[0] : null;

    this.initialSensorsState = sensors.map(s => this.cloneSensor(s));
    this.initialSensorSpheresState = sensorSpheres.map(ss =>
      this.cloneSensorSphere(ss)
    );
  }

  private cloneSensor(sensor: Sensor): Sensor {
    return new Sensor(
      sensor.id,
      sensor.position.clone(),
      sensor.velocity.clone(),
      sensor.mass,
      sensor.charge,
      sensor.state
    );
  }

  private cloneSensorSphere(sphere: SensorSphere): SensorSphere {
    return new SensorSphere(
      sphere.id,
      sphere.center.clone(),
      sphere.radius,
      sphere.sensors.length,
      sphere.state
    );
  }

  public start(): void {
    this.running = true;
    Logger.info('Starting simulation engine.', 'SimulationEngine.start');
    this.loop();
  }

  public pause(): void {
    this.running = false;
    Logger.info('Pausing simulation engine.', 'SimulationEngine.pause');
  }

  public toggleTimeReversal(): void {
    this.timeReversed = !this.timeReversed;
    this.sensors.forEach(sensor => {
      sensor.velocity = sensor.velocity.multiplyScalar(-1);
    });
    this.sensorSpheres.forEach(sphere => {
      sphere.velocity = sphere.velocity.multiplyScalar(-1);
    });
    Logger.info(
      `Time reversal toggled. Now ${
        this.timeReversed ? 'reversed' : 'forward'
      }.`,
      'SimulationEngine.toggleTimeReversal'
    );
  }

  public reset(): void {
    this.globalTime = 0;
    this.sensors = this.initialSensorsState.map(s => this.cloneSensor(s));
    this.sensorSpheres = this.initialSensorSpheresState.map(ss =>
      this.cloneSensorSphere(ss)
    );
    this.container =
      this.sensorSpheres.length > 0 ? this.sensorSpheres[0] : null;
    Logger.info('Simulation has been reset.', 'SimulationEngine.reset');
  }

  public randomize(): void {
    this.sensors.forEach(sensor => {
      sensor.position = new Vector3(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      sensor.velocity = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
    });
    Logger.info('Sensors have been randomized.', 'SimulationEngine.randomize');
  }

  public update(): void {
    if (!this.running) return;
    if (this.deltaTime <= 0) {
      throw new Error('Delta time must be greater than zero.');
    }

    const step = this.timeReversed ? -this.deltaTime : this.deltaTime;
    this.globalTime += step;
    const dt = Math.abs(step);

    this.sensorSpheres.forEach(sphere => sphere.update(dt));
    this.sensors.forEach(sensor => sensor.update(dt));

    this.handleSensorCollisions();

    for (let i = 0; i < this.sensorSpheres.length; i++) {
      for (let j = i + 1; j < this.sensorSpheres.length; j++) {
        this.sensorSpheres[i].calculateForces([this.sensorSpheres[j]]);
        this.sensorSpheres[j].calculateForces([this.sensorSpheres[i]]);
      }
    }

    if (this.container !== null) {
      const containerSphere: SensorSphere = this.container; // now containerSphere is not null
      this.sensors.forEach(sensor => {
        this.handleContainerCollision(sensor, containerSphere);
      });
    }

    Logger.debug(
      `Simulation time: ${this.globalTime.toFixed(3)} s`,
      'SimulationEngine.update'
    );
  }

  private loop(): void {
    if (!this.running) return;
    this.update();
    setTimeout(() => this.loop(), this.deltaTime * 1000);
  }

  public addSensor(sensor: Sensor): void {
    if (!sensor) {
      throw new Error('Sensor cannot be null or undefined.');
    }
    this.sensors.push(sensor);
  }

  public addSensorSphere(sphere: SensorSphere): void {
    if (!sphere) {
      throw new Error('SensorSphere cannot be null or undefined.');
    }
    this.sensorSpheres.push(sphere);
  }

  private handleSensorCollisions(): void {
    for (let i = 0; i < this.sensors.length; i++) {
      for (let j = i + 1; j < this.sensors.length; j++) {
        const sensor1 = this.sensors[i];
        const sensor2 = this.sensors[j];

        const radius1 = (sensor1 as any).radius || 0.2;
        const radius2 = (sensor2 as any).radius || 0.2;
        const sumRadii = radius1 + radius2;

        const distanceVector = sensor2.position.subtract(sensor1.position);
        const distance = distanceVector.magnitude();

        if (distance > 0 && distance < sumRadii) {
          this.handleCollision(sensor1, sensor2, distanceVector, distance);
        }
      }
    }
  }

  private handleCollision(
    sensor1: Sensor,
    sensor2: Sensor,
    distanceVector: Vector3,
    _distance: number
  ): void {
    const normal = distanceVector.normalize();
    const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
    const speed = relativeVelocity.dot(normal);
    if (speed >= 0) return; // Sensors are separating; no collision response needed.

    const totalMass = sensor1.mass + sensor2.mass;
    const impulse = (2 * speed) / totalMass;

    sensor1.velocity = sensor1.velocity.subtract(
      normal.multiplyScalar(impulse * sensor2.mass)
    );
    sensor2.velocity = sensor2.velocity.add(
      normal.multiplyScalar(impulse * sensor1.mass)
    );

    Logger.debug(
      `Collision handled between sensor ${sensor1.id} and sensor ${sensor2.id}.`,
      'SimulationEngine.handleCollision'
    );
  }

  private handleContainerCollision(
    sensor: Sensor,
    container: SensorSphere
  ): void {
    const distanceFromCenter = sensor.position.distanceTo(container.center);
    if (distanceFromCenter > container.radius) {
      const normal = sensor.position.subtract(container.center).normalize();
      const dotProd = sensor.velocity.dot(normal);
      sensor.velocity = sensor.velocity.subtract(
        normal.multiplyScalar(2 * dotProd)
      );
      sensor.position = container.center.add(
        normal.multiplyScalar(container.radius)
      );
      Logger.debug(
        `Sensor ${sensor.id} collided with container boundary of sphere ${container.id}.`,
        'SimulationEngine.handleContainerCollision'
      );
    }
  }
}
