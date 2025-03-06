import { Vector3 } from '../src/core/Vector3';

describe('Vector3 Class Unit Tests', () => {
  test('Default constructor initializes components to zero', () => {
    const vector = new Vector3();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
    expect(vector.z).toBe(0);
  });

  test('Constructor initializes components to specified values', () => {
    const vector = new Vector3(1, -2, 3.5);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(-2);
    expect(vector.z).toBe(3.5);
  });

  test('add() correctly adds two vectors', () => {
    const vectorA = new Vector3(1, 2, 3);
    const vectorB = new Vector3(4, -5, 6);
    const result = vectorA.add(vectorB);
    expect(result).toEqual(new Vector3(5, -3, 9));
  });

  test('subtract() correctly subtracts two vectors', () => {
    const vectorA = new Vector3(5, 7, 9);
    const vectorB = new Vector3(1, 2, 3);
    const result = vectorA.subtract(vectorB);
    expect(result).toEqual(new Vector3(4, 5, 6));
  });

  test('multiplyScalar() correctly multiplies vector by scalar', () => {
    const vector = new Vector3(1, -2, 3);
    const scalar = 2;
    const result = vector.multiplyScalar(scalar);
    expect(result).toEqual(new Vector3(2, -4, 6));
  });

  test('magnitude() returns correct magnitude of vector', () => {
    const vector = new Vector3(3, 4, 0);
    const magnitude = vector.magnitude();
    expect(magnitude).toBeCloseTo(5);
  });

  test('normalize() returns a vector with magnitude 1', () => {
    const vector = new Vector3(3, 4, 0);
    const normalized = vector.normalize();
    expect(normalized.magnitude()).toBeCloseTo(1);
    expect(normalized.x).toBeCloseTo(0.6);
    expect(normalized.y).toBeCloseTo(0.8);
    expect(normalized.z).toBe(0);
  });

  test('normalize() throws error when vector has zero length', () => {
    const vector = new Vector3(0, 0, 0);
    expect(() => vector.normalize()).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });

  test('dot() returns correct dot product', () => {
    const vectorA = new Vector3(1, 3, -5);
    const vectorB = new Vector3(4, -2, -1);
    const dotProduct = vectorA.dot(vectorB);
    expect(dotProduct).toBe(3);
  });

  test('cross() returns correct cross product', () => {
    const vectorA = new Vector3(2, 3, 4);
    const vectorB = new Vector3(5, 6, 7);
    const result = vectorA.cross(vectorB);
    expect(result).toEqual(new Vector3(-3, 6, -3));
  });

  test('distanceTo() returns correct distance between vectors', () => {
    const vectorA = new Vector3(1, 1, 1);
    const vectorB = new Vector3(4, 5, 6);
    const distance = vectorA.distanceTo(vectorB);

    // The correct distance is sqrt(50) ≈ 7.0710678118654755
    expect(distance).toBeCloseTo(7.0710678118654755, 10);
  });

  test('clone() creates an exact copy of the vector', () => {
    const vector = new Vector3(1, 2, 3);
    const clone = vector.clone();
    expect(clone).toEqual(vector);
    expect(clone).not.toBe(vector); // Ensure it's a different instance
  });

  test('toArray() returns correct array representation', () => {
    const vector = new Vector3(1, 2, 3);
    const array = vector.toArray();
    expect(array).toEqual([1, 2, 3]);
  });

  test('toString() returns correct string representation', () => {
    const vector = new Vector3(1, 2, 3);
    const string = vector.toString();
    expect(string).toBe('Vector3(1, 2, 3)');
  });
});
