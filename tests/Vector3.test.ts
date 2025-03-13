/// <reference types="jest" />

import { Vector3 } from '../src/core/Vector3';

describe('Vector3 Class', () => {
  test('constructor initializes components correctly', () => {
    const vec = new Vector3(1, 2, 3);
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(2);
    expect(vec.z).toEqual(3);
  });

  test('default constructor creates zero vector', () => {
    const vec = new Vector3();
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(0);
  });

  test('add returns correct sum vector', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    const sum = v1.add(v2);
    expect(sum.x).toEqual(5);
    expect(sum.y).toEqual(7);
    expect(sum.z).toEqual(9);
  });

  test('subtract returns correct difference vector', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(1, 2, 3);
    const diff = v1.subtract(v2);
    expect(diff.x).toEqual(4);
    expect(diff.y).toEqual(5);
    expect(diff.z).toEqual(6);
  });

  test('multiplyScalar returns correctly scaled vector', () => {
    const vec = new Vector3(1, 2, 3);
    const scaled = vec.multiplyScalar(3);
    expect(scaled.x).toEqual(3);
    expect(scaled.y).toEqual(6);
    expect(scaled.z).toEqual(9);
  });

  test('divideScalar returns correctly scaled vector', () => {
    const vec = new Vector3(2, 4, 6);
    const result = vec.divideScalar(2);
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(2);
    expect(result.z).toBeCloseTo(3);
  });

  test('divideScalar throws error when dividing by zero', () => {
    const vec = new Vector3(2, 4, 6);
    expect(() => vec.divideScalar(0)).toThrow(
      'Division by zero in Vector3.divideScalar'
    );
  });

  test('dot returns correct dot product', () => {
    const a = new Vector3(1, 2, 3);
    const b = new Vector3(4, -5, 6);
    // 1*4 + 2*(-5) + 3*6 = 4 - 10 + 18 = 12
    expect(a.dot(b)).toBeCloseTo(12);
  });

  test('cross returns correct cross product', () => {
    const a = new Vector3(1, 0, 0);
    const b = new Vector3(0, 1, 0);
    const cross = a.cross(b);
    // Expected cross (1,0,0) x (0,1,0) = (0, 0, 1)
    expect(cross.x).toBeCloseTo(0);
    expect(cross.y).toBeCloseTo(0);
    expect(cross.z).toBeCloseTo(1);
  });

  test('magnitude returns correct value', () => {
    const vec = new Vector3(3, 4, 0);
    expect(vec.magnitude()).toBeCloseTo(5);
  });

  test('normalize returns a unit vector', () => {
    const vec = new Vector3(3, 4, 0);
    const norm = vec.normalize();
    expect(norm.magnitude()).toBeCloseTo(1);
    expect(norm.x).toBeCloseTo(3 / 5);
    expect(norm.y).toBeCloseTo(4 / 5);
    expect(norm.z).toBeCloseTo(0);
  });

  test('normalize throws error for zero-length vector', () => {
    const zeroVec = new Vector3(0, 0, 0);
    expect(() => zeroVec.normalize()).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });

  test('distanceTo returns correct distance between two vectors', () => {
    const a = new Vector3(1, 1, 1);
    const b = new Vector3(4, 5, 1);
    // Distance = sqrt( (3)^2 + (4)^2 + (0)^2 ) = 5
    expect(a.distanceTo(b)).toBeCloseTo(5);
  });

  test('clone returns an identical but separate vector', () => {
    const vec = new Vector3(1, 2, 3);
    const copy = vec.clone();
    expect(copy).toEqual(vec);
    copy.x = 10;
    expect(vec.x).toEqual(1); // Original remains unchanged.
  });

  test('copy mutates the target vector and returns the same instance', () => {
    const target = new Vector3();
    const source = new Vector3(4, 5, 6);
    const returned = target.copy(source);
    // target should now have the same components as source.
    expect(target).toEqual(source);
    // The returned object is exactly the same instance as target.
    expect(returned).toBe(target);
  });

  test('set updates vector components correctly', () => {
    const vec = new Vector3();
    vec.set(7, 8, 9);
    expect(vec.x).toEqual(7);
    expect(vec.y).toEqual(8);
    expect(vec.z).toEqual(9);
  });

  test('rotateAroundAxis rotates vector correctly', () => {
    const vec = new Vector3(1, 0, 0);
    // Rotate around Z-axis by 90°: expect (0,1,0)
    const axis = new Vector3(0, 0, 1).normalize();
    const rotated = vec.rotateAroundAxis(axis, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
    expect(rotated.z).toBeCloseTo(0, 5);
  });

  test('zero returns a vector with all components zero', () => {
    const zeroVec = Vector3.zero();
    expect(zeroVec.x).toEqual(0);
    expect(zeroVec.y).toEqual(0);
    expect(zeroVec.z).toEqual(0);
  });

  test('toArray returns an array of components', () => {
    const vec = new Vector3(3.5, -2.1, 7.8);
    expect(vec.toArray()).toEqual([3.5, -2.1, 7.8]);
  });
});
