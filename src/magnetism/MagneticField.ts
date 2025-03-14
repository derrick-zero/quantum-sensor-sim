import { Sensor } from '../sensors/Sensor';
import { Vector3 } from '../core/Vector3';
import { Constants } from '../core/Constants';
import { Logger } from '../core/Logger';

/**
 * Utility class for calculating magnetic fields generated by sensors,
 * including time-dependent effects and coupling with electric fields.
 */
export class MagneticField {
  /**
   * Calculates the magnetic field at a given point due to a single sensor using
   * the point-charge approximation of the Biot–Savart law:
   *
   *    B = (μ₀ / (4π)) * (q (v x r)) / |r|³
   *
   * @param sensor - The sensor generating the field.
   * @param point - The evaluation point in space.
   * @returns The static magnetic field vector at the specified point.
   * @throws Error if the evaluation point coincides with the sensor's position.
   */
  public static calculateFieldAtPoint(sensor: Sensor, point: Vector3): Vector3 {
    const mu0 = Constants.PERMEABILITY_OF_FREE_SPACE;
    const factor = mu0 / (4 * Math.PI);
    const rVector = point.subtract(sensor.position);
    const distance = rVector.magnitude();
    if (distance === 0) {
      throw new Error(
        'Evaluation point cannot be the same as the sensor position.'
      );
    }
    const crossProduct = sensor.velocity.cross(rVector);
    const fieldMagnitudeFactor =
      (factor * sensor.charge) / Math.pow(distance, 3);
    return crossProduct.multiplyScalar(fieldMagnitudeFactor);
  }

  /**
   * Calculates a time-dependent magnetic field at a given point due to a sensor.
   * The static magnetic field is modulated by a sinusoidal function of time.
   *
   * @param sensor - The sensor generating the field.
   * @param point - The evaluation point in space.
   * @param time - The time (in seconds) at which to evaluate the field.
   * @param frequency - The modulation frequency in Hz (default is 1 Hz).
   * @returns The time-dependent magnetic field vector.
   */
  public static calculateFieldAtPointTimeDependent(
    sensor: Sensor,
    point: Vector3,
    time: number,
    frequency: number = 1
  ): Vector3 {
    // Get the static magnetic field:
    const staticField = MagneticField.calculateFieldAtPoint(sensor, point);
    // Modulate the field amplitude using a sinusoidal function.
    // B(t) = B_static * sin(2π * frequency * time)
    const modulationFactor = Math.sin(Constants.TWO_PI * frequency * time);
    return staticField.multiplyScalar(modulationFactor);
  }

  /**
   * Calculates the net magnetic field at a given point due to an array of sensors.
   *
   * @param sensors - Array of sensors.
   * @param point - The evaluation point in space.
   * @returns The net magnetic field vector.
   */
  public static calculateNetField(sensors: Sensor[], point: Vector3): Vector3 {
    let netField = new Vector3();
    for (const sensor of sensors) {
      try {
        const field = MagneticField.calculateFieldAtPoint(sensor, point);
        netField = netField.add(field);
      } catch (error) {
        Logger.warn(
          `Skipping sensor ${sensor.id} due to error: ${
            (error as Error).message
          }`,
          'MagneticField.calculateNetField'
        );
      }
    }
    return netField;
  }

  /**
   * Couples an external electric field with the magnetic field.
   * This method serves as a placeholder to model more advanced coupling effects.
   *
   * @param magneticField - The calculated magnetic field vector.
   * @param electricField - The external electric field vector.
   * @returns A new magnetic field vector, modified by the electric field.
   */
  public static coupleWithElectricField(
    magneticField: Vector3,
    electricField: Vector3
  ): Vector3 {
    // Placeholder: scale the magnetic field by a factor based on the electric field's magnitude.
    // For instance, our simple scaling factor could be 1 + 0.01 * |E|
    const scalingFactor = 1 + 0.01 * electricField.magnitude();
    return magneticField.multiplyScalar(scalingFactor);
  }

  /**
   * Generates an electromagnetic wave profile by combining electric and magnetic fields.
   * This is a high-level placeholder for more complex simulations.
   *
   * @param sensor - The sensor generating the wave.
   * @param point - The evaluation point in space.
   * @param time - The current time in seconds.
   * @returns An object containing both electric and magnetic field components and the wave frequency.
   */
  public static generateElectromagneticWave(
    sensor: Sensor,
    point: Vector3,
    time: number
  ): { electricField: Vector3; magneticField: Vector3; frequency: number } {
    const frequency = 60; // Example frequency of 60 Hz for the wave.
    // Placeholder: For now, we'll set electricField to a zero vector; integrate with ElectricField module later.
    const electricField = new Vector3();
    // Compute a time-dependent magnetic field.
    const magneticField = MagneticField.calculateFieldAtPointTimeDependent(
      sensor,
      point,
      time,
      frequency
    );
    Logger.debug(
      `Generated EM wave at time ${time} sec with frequency ${frequency} Hz.`,
      'MagneticField.generateElectromagneticWave'
    );
    return { electricField, magneticField, frequency };
  }
}
