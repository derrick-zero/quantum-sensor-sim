# API Reference

This document provides a reference for the utility functions available in the project. These functions perform common vector operations and other calculations used throughout the simulation.

---

## **Utils**

Utility functions for various calculations and operations.

### `generateRandomNumber(min: number, max: number): number`

**Description:**
Generates a random number within the specified range.

**Parameters:**

- `min`: The minimum value.
- `max`: The maximum value.

**Returns:**
A random number between `min` and `max`.

---

### `calculateVectorMagnitude(vector: Vector3): number`

**Description:**
Calculates the magnitude (length) of a vector.

**Parameters:**

- `vector`: The vector whose magnitude is to be calculated.

**Returns:**
The magnitude of the vector.

---

### `normalizeVector(vector: Vector3): Vector3`

**Description:**
Normalizes a vector so that its magnitude becomes 1.

**Parameters:**

- `vector`: The vector to normalize.

**Returns:**
A new `Vector3` that is the normalized form of the input vector.

---

### `dotProduct(vectorA: Vector3, vectorB: Vector3): number`

**Description:**
Calculates the dot product of two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

**Returns:**
The dot product (a scalar value).

---

### `crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3`

**Description:**
Calculates the cross product of two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

**Returns:**
A new `Vector3` representing the cross product.

---

### `distanceBetweenPoints(pointA: Vector3, pointB: Vector3): number`

**Description:**
Calculates the Euclidean distance between two points in space.

**Parameters:**

- `pointA`: The first point (as a `Vector3`).
- `pointB`: The second point (as a `Vector3`).

**Returns:**
The distance between the two points.

---

### `clamp(value: number, min: number, max: number): number`

**Description:**
Clamps a number so that it falls within a specified range.

**Parameters:**

- `value`: The number to clamp.
- `min`: The minimum permissible value.
- `max`: The maximum permissible value.

**Returns:**
A number constrained between `min` and `max`.

---

### `lerp(start: number, end: number, t: number): number`

**Description:**
Performs a linear interpolation between `start` and `end` based on a factor `t`.

**Parameters:**

- `start`: The start value.
- `end`: The end value.
- `t`: The interpolation factor, typically between 0 and 1.

**Returns:**
The interpolated value.

---

### `angleBetweenVectors(vectorA: Vector3, vectorB: Vector3): number`

**Description:**
Calculates the angle in radians between two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

**Returns:**
The angle in radians between `vectorA` and `vectorB`.

---

### `projection(vectorA: Vector3, vectorB: Vector3): Vector3`

**Description:**
Projects vector A onto vector B.

**Parameters:**

- `vectorA`: The vector to be projected.
- `vectorB`: The vector onto which to project.

**Returns:**
A new `Vector3` representing the projection of `vectorA` onto `vectorB`.

---

### **Notes**

- All vector-related functions work with instances of `Vector3`.
- The utility functions serve as building blocks for the simulation’s physics and can be extended as needed.
