/// <reference types="jest" />

import { Vector3 } from '../src/core/Vector3';

describe('Vector3', () => {
  test('constructor sets components correctly', () => {
    const vec = new Vector3(1, 2, 3);
    expect(vec.x).toBe(1);
    expect(vec.y).toBe(2);
    expect(vec.z).toBe(3);
  });

  test('add returns correct sum vector', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    const sum = v1.add(v2);
    expect(sum.x).toBe(5);
    expect(sum.y).toBe(7);
    expect(sum.z).toBe(9);
  });

  test('subtract returns correct difference vector', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(1, 2, 3);
    const diff = v1.subtract(v2);
    expect(diff.x).toBe(4);
    expect(diff.y).toBe(5);
    expect(diff.z).toBe(6);
  });

  test('multiplyScalar returns correctly scaled vector', () => {
    const vec = new Vector3(1, 2, 3);
    const scaled = vec.multiplyScalar(3);
    expect(scaled.x).toBe(3);
    expect(scaled.y).toBe(6);
    expect(scaled.z).toBe(9);
  });

  test('divideScalar returns correctly scaled vector', () => {
    const vec = new Vector3(2, 4, 6);
    const result = vec.divideScalar(2);
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
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
    // Expected cross product: (0, 0, 1)
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
    const zeroVector = new Vector3(0, 0, 0);
    expect(() => zeroVector.normalize()).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });

  test('distanceTo returns correct distance', () => {
    const pointA = new Vector3(1, 1, 1);
    const pointB = new Vector3(4, 5, 1);
    // Distance should be sqrt((3)^2 + (4)^2 + 0^2) = 5
    expect(pointA.distanceTo(pointB)).toBeCloseTo(5);
  });

  test('clone returns an identical vector and does not affect the original', () => {
    const vec = new Vector3(1, 2, 3);
    const copy = vec.clone();
    expect(copy.x).toBe(vec.x);
    expect(copy.y).toBe(vec.y);
    expect(copy.z).toBe(vec.z);
    // Ensure it is a separate instance
    copy.x = 10;
    expect(vec.x).toBe(1);
  });

  test('set updates vector components correctly', () => {
    const vec = new Vector3();
    vec.set(7, 8, 9);
    expect(vec.x).toBe(7);
    expect(vec.y).toBe(8);
    expect(vec.z).toBe(9);
  });

  test('rotateAroundAxis rotates vector correctly', () => {
    const vec = new Vector3(1, 0, 0);
    const axis = new Vector3(0, 0, 1).normalize();
    const rotated = vec.rotateAroundAxis(axis, Math.PI / 2);
    // Rotating (1,0,0) around the Z-axis by 90° should give (0,1,0)
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
    expect(rotated.z).toBeCloseTo(0, 5);
  });
});
