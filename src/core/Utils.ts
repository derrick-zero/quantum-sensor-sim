import { Vector3 } from './Vector3';

/**
 * The Utils class provides a collection of static helper functions for
 * mathematical operations and vector calculations commonly used in Quantum Sensor Sim.
 */
export class Utils {
  /**
   * Generates a random number within the specified range.
   * @param min - The minimum value (inclusive).
   * @param max - The maximum value (exclusive).
   * @returns A random number between min and max.
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Calculates the magnitude (length) of a vector.
   * @param vector - The vector for which to calculate the magnitude.
   * @returns The magnitude of the vector.
   */
  static calculateVectorMagnitude(vector: Vector3): number {
    return Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
  }

  /**
   * Normalizes a vector so that its magnitude becomes 1.
   * @param vector - The vector to normalize.
   * @returns A new Vector3 that is the normalized vector.
   */
  static normalizeVector(vector: Vector3): Vector3 {
    const magnitude = Utils.calculateVectorMagnitude(vector);
    // Avoid division by zero.
    if (magnitude === 0) {
      throw new Error('Cannot normalize a zero-length vector.');
    }
    return new Vector3(
      vector.x / magnitude,
      vector.y / magnitude,
      vector.z / magnitude
    );
  }

  /**
   * Calculates the dot product of two vectors.
   * @param vectorA - The first vector.
   * @param vectorB - The second vector.
   * @returns The dot product (a scalar) of the two vectors.
   */
  static dotProduct(vectorA: Vector3, vectorB: Vector3): number {
    return (
      vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z
    );
  }

  /**
   * Calculates the cross product of two vectors.
   * @param vectorA - The first vector.
   * @param vectorB - The second vector.
   * @returns A new Vector3 representing the cross product.
   */
  static crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3 {
    return new Vector3(
      vectorA.y * vectorB.z - vectorA.z * vectorB.y,
      vectorA.z * vectorB.x - vectorA.x * vectorB.z,
      vectorA.x * vectorB.y - vectorA.y * vectorB.x
    );
  }

  /**
   * Calculates the distance between two points in space.
   * @param pointA - The first point as a Vector3.
   * @param pointB - The second point as a Vector3.
   * @returns The Euclidean distance between the two points.
   */
  static distanceBetweenPoints(pointA: Vector3, pointB: Vector3): number {
    return Utils.calculateVectorMagnitude(
      new Vector3(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z)
    );
  }

  /**
   * Clamps a number within the specified minimum and maximum values.
   * @param value - The number to clamp.
   * @param min - The minimum permissible value.
   * @param max - The maximum permissible value.
   * @returns The clamped value.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Performs linear interpolation between start and end by a factor t.
   * @param start - The start value.
   * @param end - The end value.
   * @param t - The interpolation factor, commonly between 0 and 1.
   * @returns The interpolated value.
   */
  static lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
  }

  /**
   * Calculates the angle in radians between two vectors.
   * @param vectorA - The first vector.
   * @param vectorB - The second vector.
   * @returns The angle between the vectors in radians.
   */
  static angleBetweenVectors(vectorA: Vector3, vectorB: Vector3): number {
    const dot = Utils.dotProduct(vectorA, vectorB);
    const magProduct =
      Utils.calculateVectorMagnitude(vectorA) *
      Utils.calculateVectorMagnitude(vectorB);
    // Clamp to avoid rounding errors in acos.
    const cosine = Utils.clamp(dot / magProduct, -1, 1);
    return Math.acos(cosine);
  }

  /**
   * Projects vectorA onto vectorB.
   * @param vectorA - The vector to project.
   * @param vectorB - The vector onto which to project.
   * @returns A new Vector3 representing the projection of vectorA onto vectorB.
   */
  static projection(vectorA: Vector3, vectorB: Vector3): Vector3 {
    const dotProd = Utils.dotProduct(vectorA, vectorB);
    const magnitudeSquared = Utils.calculateVectorMagnitude(vectorB) ** 2;
    const scalarProjection = dotProd / magnitudeSquared;
    return new Vector3(
      vectorB.x * scalarProjection,
      vectorB.y * scalarProjection,
      vectorB.z * scalarProjection
    );
  }
}
