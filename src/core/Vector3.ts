/**
 * Represents a three-dimensional vector and provides common vector operations.
 */
export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  /**
   * Creates a new Vector3 instance.
   * @param x - The x component (default is 0).
   * @param y - The y component (default is 0).
   * @param z - The z component (default is 0).
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Returns a new Vector3 with all components equal to zero.
   */
  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  /**
   * Sets the components of this vector.
   * @param x - The new x component.
   * @param y - The new y component.
   * @param z - The new z component.
   * @returns This vector.
   */
  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Copies the components of the given vector into this vector.
   * @param vector - The vector to copy.
   * @returns This vector.
   */
  public copy(vector: Vector3): this {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }

  /**
   * Adds another vector to this vector and returns the result.
   * @param other - The vector to add.
   * @returns A new Vector3 representing the sum.
   */
  public add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  /**
   * Subtracts another vector from this vector and returns the result.
   * @param other - The vector to subtract.
   * @returns A new Vector3 representing the difference.
   */
  public subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  /**
   * Multiplies this vector by a scalar and returns the result.
   * @param scalar - The scalar value.
   * @returns A new Vector3 representing the product.
   */
  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  /**
   * Computes the magnitude (length) of the vector.
   * @returns The magnitude (length) of the vector.
   */
  public magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  /**
   * Normalizes the vector (scales it to unit length).
   * @returns A new Vector3 that is normalized.
   * @throws Error if the vector has zero length.
   */
  public normalize(): Vector3 {
    const mag = this.magnitude();
    if (mag === 0) {
      throw new Error('Cannot normalize a zero-length vector.');
    }
    return this.multiplyScalar(1 / mag);
  }

  /**
   * Computes the dot product with another vector.
   * @param other - The other vector.
   * @returns The dot product between this vector and the other vector.
   */
  public dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  /**
   * Computes the cross product with another vector.
   * @param other - The other vector.
   * @returns A new Vector3 representing the cross product.
   */
  public cross(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  /**
   * Computes the distance between this vector and another.
   * @param other - The other vector.
   * @returns The Euclidean distance between the two vectors.
   */
  public distanceTo(other: Vector3): number {
    return Math.sqrt(
      (this.x - other.x) ** 2 +
        (this.y - other.y) ** 2 +
        (this.z - other.z) ** 2
    );
  }

  /**
   * Creates a clone of this vector.
   * @returns A new Vector3 instance with the same components.
   */
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Converts this vector to an array [x, y, z].
   * @returns An array representation of this vector.
   */
  public toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Returns a string representation of the vector.
   * @returns A string in the format 'Vector3(x, y, z)'.
   */
  public toString(): string {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * Rotates this vector around a given axis by a specified angle using Rodrigues' rotation formula.
   * The axis should be non-zero; it is normalized automatically.
   * @param axis - The axis around which to rotate.
   * @param angle - The rotation angle in radians.
   * @returns A new Vector3 representing the rotated vector.
   */
  public rotateAroundAxis(axis: Vector3, angle: number): Vector3 {
    // Normalize the rotation axis.
    const k = axis.normalize();
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    // Rodrigues' rotation formula:
    // v_rot = v * cos(angle) + (k x v) * sin(angle) + k * (k ⋅ v) * (1 - cos(angle))
    const term1 = this.multiplyScalar(cosTheta);
    const term2 = k.cross(this).multiplyScalar(sinTheta);
    const term3 = k.multiplyScalar(k.dot(this) * (1 - cosTheta));

    return term1.add(term2).add(term3);
  }
}
