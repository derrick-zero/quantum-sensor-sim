// tests/Utils.test.ts

import { Utils } from '../src/core/Utils';
import { Vector3 } from '../src/core/Vector3';

describe('Utils', () => {
  test('generateRandomNumber should return a number within the specified range', () => {
    const min = 1;
    const max = 10;
    const randomNum = Utils.generateRandomNumber(min, max);
    expect(randomNum).toBeGreaterThanOrEqual(min);
    expect(randomNum).toBeLessThanOrEqual(max);
  });

  test('calculateVectorMagnitude should return the correct magnitude of a vector', () => {
    const vector = new Vector3(3, 4, 0);
    const magnitude = Utils.calculateVectorMagnitude(vector);
    expect(magnitude).toBeCloseTo(5);
  });

  test('normalizeVector should return a normalized vector', () => {
    const vector = new Vector3(3, 4, 0);
    const normalized = Utils.normalizeVector(vector);
    const magnitude = Utils.calculateVectorMagnitude(normalized);
    expect(magnitude).toBeCloseTo(1);
  });

  test('dotProduct should return the correct dot product of two vectors', () => {
    const vectorA = new Vector3(1, 2, 3);
    const vectorB = new Vector3(4, 5, 6);
    const dot = Utils.dotProduct(vectorA, vectorB);
    expect(dot).toBe(32);
  });

  test('crossProduct should return the correct cross product of two vectors', () => {
    const vectorA = new Vector3(1, 0, 0);
    const vectorB = new Vector3(0, 1, 0);
    const cross = Utils.crossProduct(vectorA, vectorB);
    expect(cross).toEqual(new Vector3(0, 0, 1));
  });

  test('distanceBetweenPoints should return the correct distance between two points', () => {
    const pointA = new Vector3(0, 0, 0);
    const pointB = new Vector3(3, 4, 0);
    const distance = Utils.distanceBetweenPoints(pointA, pointB);
    expect(distance).toBeCloseTo(5);
  });

  test('clamp should return the value clamped between the specified range', () => {
    expect(Utils.clamp(5, 1, 10)).toBe(5);
    expect(Utils.clamp(0, 1, 10)).toBe(1);
    expect(Utils.clamp(15, 1, 10)).toBe(10);
  });

  test('lerp should return the linearly interpolated value', () => {
    expect(Utils.lerp(0, 10, 0.5)).toBe(5);
    expect(Utils.lerp(0, 10, 1)).toBe(10);
    expect(Utils.lerp(0, 10, 0)).toBe(0);
  });

  test('angleBetweenVectors should return the correct angle between two vectors', () => {
    const vectorA = new Vector3(1, 0, 0);
    const vectorB = new Vector3(0, 1, 0);
    const angle = Utils.angleBetweenVectors(vectorA, vectorB);
    expect(angle).toBeCloseTo(Math.PI / 2);
  });

  test('projection should return the correct projection of vectorA onto vectorB', () => {
    const vectorA = new Vector3(1, 2, 3);
    const vectorB = new Vector3(4, 5, 6);
    const projection = Utils.projection(vectorA, vectorB);
    expect(projection.x).toBeCloseTo(1.6623376623376625);
    expect(projection.y).toBeCloseTo(2.0779220779220777);
    expect(projection.z).toBeCloseTo(2.4935064935064934);
  });
});
