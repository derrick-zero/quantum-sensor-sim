# API Reference

## Utils

Utility functions for various calculations and operations.

### `generateRandomNumber(min: number, max: number): number`

Generates a random number within the specified range.

**Parameters:**

- `min`: The minimum value.
- `max`: The maximum value.

### `calculateVectorMagnitude(vector: Vector3): number`

Calculates the magnitude of a vector.

**Parameters:**

- `vector`: The vector.

### `normalizeVector(vector: Vector3): Vector3`

Normalizes a vector to have a magnitude of 1.

**Parameters:**

- `vector`: The vector.

### `dotProduct(vectorA: Vector3, vectorB: Vector3): number`

Calculates the dot product of two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

### `crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3`

Calculates the cross product of two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

### `distanceBetweenPoints(pointA: Vector3, pointB: Vector3): number`

Calculates the distance between two points in space.

**Parameters:**

- `pointA`: The first point.
- `pointB`: The second point.

### `clamp(value: number, min: number, max: number): number`

Clamps a value between a minimum and maximum range.

**Parameters:**

- `value`: The value to clamp.
- `min`: The minimum range.
- `max`: The maximum range.

### `lerp(start: number, end: number, t: number): number`

Linearly interpolates between `start` and `end` by `t`.

**Parameters:**

- `start`: The start value.
- `end`: The end value.
- `t`: The interpolation factor.

### `angleBetweenVectors(vectorA: Vector3, vectorB: Vector3): number`

Calculates the angle between two vectors.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.

### `projection(vectorA: Vector3, vectorB: Vector3): Vector3`

Projects vector A onto vector B.

**Parameters:**

- `vectorA`: The first vector.
- `vectorB`: The second vector.
