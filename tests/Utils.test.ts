/// <reference types="jest" />

import { Utils } from '../src/core/Utils';
import { Vector3 } from '../src/core/Vector3';

describe('Utils', () => {
  test('generateRandomNumber returns a value within the specified range', () => {
    const min = 5;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const value = Utils.generateRandomNumber(min, max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThan(max);
    }
  });

  test('calculateVectorMagnitude returns the correct magnitude', () => {
    const v = new Vector3(3, 4, 0);
    const mag = Utils.calculateVectorMagnitude(v);
    expect(mag).toBeCloseTo(5);
  });

  test('normalizeVector returns a unit vector', () => {
    const v = new Vector3(3, 4, 0);
    const norm = Utils.normalizeVector(v);
    const magnitude = Utils.calculateVectorMagnitude(norm);
    expect(magnitude).toBeCloseTo(1);
    expect(norm.x).toBeCloseTo(3 / 5);
    expect(norm.y).toBeCloseTo(4 / 5);
    expect(norm.z).toBeCloseTo(0);
  });

  test('normalizeVector throws an error for zero-length vectors', () => {
    const zeroVec = new Vector3(0, 0, 0);
    expect(() => Utils.normalizeVector(zeroVec)).toThrow(
      'Cannot normalize a zero-length vector.'
    );
  });

  test('dotProduct computes the correct dot product', () => {
    const a = new Vector3(1, 2, 3);
    const b = new Vector3(4, -5, 6);
    // 1*4 + 2*(-5) + 3*6 = 4 - 10 + 18 = 12
    const dot = Utils.dotProduct(a, b);
    expect(dot).toBeCloseTo(12);
  });

  test('crossProduct computes the correct cross product', () => {
    const a = new Vector3(1, 0, 0);
    const b = new Vector3(0, 1, 0);
    const cross = Utils.crossProduct(a, b);
    // Expected cross product is (0,0,1)
    expect(cross.x).toBeCloseTo(0);
    expect(cross.y).toBeCloseTo(0);
    expect(cross.z).toBeCloseTo(1);
  });

  test('distanceBetweenPoints returns the correct distance', () => {
    const a = new Vector3(1, 1, 1);
    const b = new Vector3(4, 5, 1);
    // Distance = sqrt(3^2 + 4^2 + 0^2) = 5
    const distance = Utils.distanceBetweenPoints(a, b);
    expect(distance).toBeCloseTo(5);
  });

  test('clamp returns the correct clamped value', () => {
    expect(Utils.clamp(5, 0, 10)).toEqual(5);
    expect(Utils.clamp(-3, 0, 10)).toEqual(0);
    expect(Utils.clamp(15, 0, 10)).toEqual(10);
  });

  test('lerp computes the correct interpolated value', () => {
    expect(Utils.lerp(0, 10, 0)).toEqual(0);
    expect(Utils.lerp(0, 10, 1)).toEqual(10);
    expect(Utils.lerp(0, 10, 0.5)).toEqual(5);
  });

  test('angleBetweenVectors computes the correct angle', () => {
    const a = new Vector3(1, 0, 0);
    const b = new Vector3(1, 0, 0);
    // Angle between identical vectors should be 0
    expect(Utils.angleBetweenVectors(a, b)).toBeCloseTo(0);
    const c = new Vector3(0, 1, 0);
    // Angle between perpendicular vectors should be π/2
    expect(Utils.angleBetweenVectors(a, c)).toBeCloseTo(Math.PI / 2);
  });

  test('projection computes the correct projection', () => {
    const a = new Vector3(2, 2, 2);
    const b = new Vector3(1, 0, 0);
    // Projection of (2,2,2) onto (1,0,0) should be (2,0,0)
    const proj = Utils.projection(a, b);
    expect(proj.x).toBeCloseTo(2);
    expect(proj.y).toBeCloseTo(0);
    expect(proj.z).toBeCloseTo(0);
  });
});
