import { Vector3 } from './Vector3';

export class Utils {
  /**
   * Generates a random number within the specified range.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} - A random number between min and max.
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Calculates the magnitude of a vector.
   * @param {Vector3} vector - The vector.
   * @returns {number} - The magnitude of the vector.
   */
  static calculateVectorMagnitude(vector: Vector3): number {
    return Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
  }

  /**
   * Normalizes a vector to have a magnitude of 1.
   * @param {Vector3} vector - The vector.
   * @returns {Vector3} - The normalized vector.
   */
  static normalizeVector(vector: Vector3): Vector3 {
    const magnitude = Utils.calculateVectorMagnitude(vector);
    return new Vector3(
      vector.x / magnitude,
      vector.y / magnitude,
      vector.z / magnitude
    );
  }

  /**
   * Calculates the dot product of two vectors.
   * @param {Vector3} vectorA - The first vector.
   * @param {Vector3} vectorB - The second vector.
   * @returns {number} - The dot product of the vectors.
   */
  static dotProduct(vectorA: Vector3, vectorB: Vector3): number {
    return (
      vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z
    );
  }

  /**
   * Calculates the cross product of two vectors.
   * @param {Vector3} vectorA - The first vector.
   * @param {Vector3} vectorB - The second vector.
   * @returns {Vector3} - The cross product of the vectors.
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
   * @param {Vector3} pointA - The first point.
   * @param {Vector3} pointB - The second point.
   * @returns {number} - The distance between the points.
   */
  static distanceBetweenPoints(pointA: Vector3, pointB: Vector3): number {
    return Utils.calculateVectorMagnitude(
      new Vector3(pointB.x - pointA.x, pointB.y - pointA.y, pointB.z - pointA.z)
    );
  }

  /**
   * Clamps a value between a minimum and maximum range.
   * @param {number} value - The value to clamp.
   * @param {number} min - The minimum range.
   * @param {number} max - The maximum range.
   * @returns {number} - The clamped value.
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Linearly interpolates between start and end by t.
   * @param {number} start - The start value.
   * @param {number} end - The end value.
   * @param {number} t - The interpolation factor.
   * @returns {number} - The interpolated value.
   */
  static lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
  }

  /**
   * Calculates the angle between two vectors.
   * @param {Vector3} vectorA - The first vector.
   * @param {Vector3} vectorB - The second vector.
   * @returns {number} - The angle between the vectors in radians.
   */
  static angleBetweenVectors(vectorA: Vector3, vectorB: Vector3): number {
    const dot = Utils.dotProduct(vectorA, vectorB);
    const magnitudes =
      Utils.calculateVectorMagnitude(vectorA) *
      Utils.calculateVectorMagnitude(vectorB);
    return Math.acos(dot / magnitudes);
  }

  /**
   * Projects vector A onto vector B.
   * @param {Vector3} vectorA - The first vector.
   * @param {Vector3} vectorB - The second vector.
   * @returns {Vector3} - The projection of vectorA onto vectorB.
   */
  static projection(vectorA: Vector3, vectorB: Vector3): Vector3 {
    const dotProduct = Utils.dotProduct(vectorA, vectorB);
    const magnitudeSquared =
      Utils.calculateVectorMagnitude(vectorB) *
      Utils.calculateVectorMagnitude(vectorB);
    const scalarProjection = dotProduct / magnitudeSquared;
    return new Vector3(
      vectorB.x * scalarProjection,
      vectorB.y * scalarProjection,
      vectorB.z * scalarProjection
    );
  }
}
