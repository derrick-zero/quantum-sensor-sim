/**
 * Vector3.ts
 *
 * This module defines a 3D vector class with common vector operations.
 * The class is designed with immutability in mind for arithmetic operations
 * (which return new Vector3 instances) while some methods (such as copy and set)
 * modify this instance.
 */
export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  /**
   * Creates a new Vector3 instance.
   * @param x - The x component (default: 0).
   * @param y - The y component (default: 0).
   * @param z - The z component (default: 0).
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Returns a new vector that is the sum of this vector and the given vector.
   * @param v - The vector to add.
   * @returns A new Vector3 representing the sum.
   */
  add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Returns a new vector that is the difference between this vector and the given vector.
   * @param v - The vector to subtract.
   * @returns A new Vector3 representing the difference.
   */
  subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * Returns a new vector which is this vector multiplied by a scalar.
   * @param scalar - The scalar to multiply.
   * @returns A new Vector3 scaled by the given scalar.
   */
  multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  /**
   * Returns a new vector which is this vector divided by a scalar.
   * @param scalar - The scalar to divide by.
   * @throws Error if dividing by 0.
   * @returns A new Vector3 scaled by the reciprocal of the scalar.
   */
  divideScalar(scalar: number): Vector3 {
    if (scalar === 0) {
      throw new Error('Division by zero in Vector3.divideScalar');
    }
    return this.multiplyScalar(1 / scalar);
  }

  /**
   * Computes the dot product of this vector with another vector.
   * @param v - The other vector.
   * @returns The dot product (a scalar).
   */
  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Computes the cross product of this vector with another vector.
   * @param v - The other vector.
   * @returns A new Vector3 that is the cross product.
   */
  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Calculates the magnitude (length) of this vector.
   * @returns The magnitude.
   */
  magnitude(): number {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Returns a new vector that is the normalized (unit-length) version of this vector.
   * @throws Error if the vector has zero length.
   * @returns A new, normalized Vector3.
   */
  normalize(): Vector3 {
    const mag = this.magnitude();
    if (mag === 0) {
      throw new Error('Cannot normalize a zero-length vector.');
    }
    return this.divideScalar(mag);
  }

  /**
   * Computes the Euclidean distance between this vector and another.
   * @param v - The other vector.
   * @returns The distance.
   */
  distanceTo(v: Vector3): number {
    return this.subtract(v).magnitude();
  }

  /**
   * Creates a clone of this vector.
   * @returns A new Vector3 with the same components.
   */
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Copies the components of the provided vector into this vector.
   * Mutates this instance and returns it.
   * @param v - The vector to copy from.
   * @returns This vector after copying.
   */
  copy(v: Vector3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Mutates this vector by setting its components.
   * @param x - The new x component.
   * @param y - The new y component.
   * @param z - The new z component.
   * @returns This vector after setting.
   */
  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Rotates this vector around a given axis by the specified angle (radians).
   * Uses Rodrigues' rotation formula.
   * @param axis - The axis to rotate around (must be normalized).
   * @param angle - The angle in radians.
   * @returns A new Vector3 representing the rotated vector.
   */
  rotateAroundAxis(axis: Vector3, angle: number): Vector3 {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);
    const dot = this.dot(axis);
    const cross = this.cross(axis);
    const term1 = this.multiplyScalar(cosTheta);
    const term2 = cross.multiplyScalar(-sinTheta);
    const term3 = axis.multiplyScalar(dot * (1 - cosTheta));
    return term1.add(term2).add(term3);
  }

  /**
   * Returns a new zero vector.
   * @returns A Vector3 with x, y, z all equal to 0.
   */
  static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  /**
   * Returns the vector's components as an array.
   * @returns An array of [x, y, z].
   */
  public toArray(): number[] {
    return [this.x, this.y, this.z];
  }
}
