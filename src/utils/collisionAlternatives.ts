import { Sensor } from '../sensors/Sensor';
import { Vector3 } from '../core/Vector3';

/**
 * Resolves a collision between two sensors by computing the final velocities using a center-of-mass (COM) transformation.
 *
 * Conservation of momentum and kinetic energy is achieved in a perfectly elastic collision using the following method:
 * 1. Compute the COM velocity:
 *      V_com = (m1*v1 + m2*v2) / (m1 + m2)
 * 2. Transform each sensor's velocity into the COM frame:
 *      u1 = v1 - V_com, u2 = v2 - V_com
 * 3. For a perfectly elastic collision in the COM frame, simply reverse the velocities:
 *      u1' = -u1, u2' = -u2
 * 4. Transform back to world coordinates:
 *      v1' = u1' + V_com, v2' = u2' + V_com
 *
 * This method is computationally efficient because it uses direct analytical calculations rather than iterative adjustments.
 *
 * @param sensor1 - The first sensor in the collision.
 * @param sensor2 - The second sensor in the collision.
 * @returns An object containing the new velocities { v1, v2 }.
 */
export function centerOfMassCollision(
  sensor1: Sensor,
  sensor2: Sensor
): { v1: Vector3; v2: Vector3 } {
  const m1 = sensor1.mass;
  const m2 = sensor2.mass;

  // Calculate center-of-mass velocity
  const vcom = sensor1.velocity
    .multiplyScalar(m1)
    .add(sensor2.velocity.multiplyScalar(m2))
    .divideScalar(m1 + m2);

  // Velocities in the COM frame
  const u1 = sensor1.velocity.subtract(vcom);
  const u2 = sensor2.velocity.subtract(vcom);

  // Reverse velocities in the COM frame for perfect elastic collision
  const u1Prime = u1.multiplyScalar(-1);
  const u2Prime = u2.multiplyScalar(-1);

  // Transform back to world frame
  const v1Prime = u1Prime.add(vcom);
  const v2Prime = u2Prime.add(vcom);

  return { v1: v1Prime, v2: v2Prime };
}

/**
 * Resolves an elastic collision between two sensors using an impulse-based method.
 *
 * This function models a perfectly elastic collision and ensures both momentum and kinetic energy are conserved.
 * It operates as follows:
 *
 * 1. **Collision Normal Calculation:**
 *    The function computes the unit normal vector from `sensor1` to `sensor2`, representing the collision axis.
 *
 * 2. **Relative Velocity and Collision Check:**
 *    It calculates the relative velocity between the sensors along this normal.
 *    If the relative speed is non-negative (i.e., sensors are moving apart or parallel), no collision response is applied.
 *
 * 3. **Impulse Calculation:**
 *    For a collision, the impulse is computed using:
 *      impulse = (2 * speed) / (m1 + m2)
 *    where `speed` is the component of the relative velocity along the normal, and `m1` and `m2` are the masses of the sensors.
 *
 * 4. **Velocity Updates:**
 *    The computed impulse is applied to each sensor—scaled by the opposing sensor’s mass—resulting in new velocities.
 *
 * **Conservation of Momentum:**
 * The method ensures that:
 *   m₁·v₁ + m₂·v₂ = m₁·v₁' + m₂·v₂'
 *
 * **Conservation of Kinetic Energy:**
 * For an elastic collision, kinetic energy is conserved:
 *   ½·m₁·|v₁|² + ½·m₂·|v₂|² = ½·m₁·|v₁'|² + ½·m₂·|v₂'|²
 *
 * **Performance Considerations:**
 * This impulse-based, direct-calculation approach is computationally efficient compared to iterative or brute-force methods.
 *
 * @param sensor1 - The first sensor involved in the collision.
 * @param sensor2 - The second sensor involved in the collision.
 * @returns An object containing the updated sensors `{ s1, s2 }` with their post-collision velocities.
 *
 * @remarks
 * If the sensors are separating (speed >= 0), the function returns the original sensors without modification.
 */
export function impulseCollision(
  sensor1: Sensor,
  sensor2: Sensor
): { s1: Sensor; s2: Sensor } {
  const normal = sensor2.position.subtract(sensor1.position).normalize();
  const relativeVelocity = sensor1.velocity.subtract(sensor2.velocity);
  const speed = relativeVelocity.dot(normal);
  if (speed >= 0) return { s1: sensor1, s2: sensor2 }; // No collision response if sensors are separating.
  const totalMass = sensor1.mass + sensor2.mass;
  const impulse = (2 * speed) / totalMass;
  sensor1.velocity = sensor1.velocity.subtract(
    normal.multiplyScalar(impulse * sensor2.mass)
  );
  sensor2.velocity = sensor2.velocity.add(
    normal.multiplyScalar(impulse * sensor1.mass)
  );
  return { s1: sensor1, s2: sensor2 };
}

/**
 * (Benchmark Only)
 * Resolves a collision between two sensors using a brute-force iterative method.
 *
 * In this approach, it first determines the target final velocities using the impulse-based method,
 * then iteratively adjusts the sensors' velocities toward these target values using a small relaxation factor.
 * The function simulates an iterative numerical method to approximate conservation.
 *
 * @param sensor1 - The first sensor in the collision.
 * @param sensor2 - The second sensor in the collision.
 * @returns An object containing the final velocities { v1, v2 }.
 */
export function bruteForceCollision(
  sensor1: Sensor,
  sensor2: Sensor
): { v1: Vector3; v2: Vector3 } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const m1 = sensor1.mass;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const m2 = sensor2.mass;

  // Starting velocities.
  let v1 = sensor1.velocity.clone();
  let v2 = sensor2.velocity.clone();

  // Compute target velocities using the impulse-based method.
  const target = impulseCollision(sensor1, sensor2);
  const target1 = target.s1.velocity;
  const target2 = target.s2.velocity;

  const tolerance = 1e-4;
  const maxIterations = 10000;
  const alpha = 0.001; // Relaxation factor.
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;
    // Adjust velocities incrementally towards the target.
    v1 = v1.add(target1.subtract(v1).multiplyScalar(alpha));
    v2 = v2.add(target2.subtract(v2).multiplyScalar(alpha));

    const diff1 = target1.subtract(v1).magnitude();
    const diff2 = target2.subtract(v2).magnitude();
    if (diff1 < tolerance && diff2 < tolerance) break;
  }
  return { v1, v2 };
}

/**
 * (Optional, Future Work)
 * Resolves a collision using a penalty-force method.
 *
 * Instead of applying an instantaneous impulse, this method would compute a repulsive
 * force based on the penetration depth between sensors, then integrate this force over
 * the collision duration to update sensor velocities.
 *
 * @remarks
 * This approach typically requires tuning parameters such as stiffness and damping,
 * and may involve more complex integration methods (e.g., Runge-Kutta). Currently,
 * this function serves as a stub and simply calls impulseCollision.
 *
 * @param sensor1 - The first sensor involved in the collision.
 * @param sensor2 - The second sensor involved in the collision.
 * @returns An object containing the final velocities { v1, v2 }.
 */
export function penaltyForceCollision(
  sensor1: Sensor,
  sensor2: Sensor
): { v1: Vector3; v2: Vector3 } {
  const result = impulseCollision(sensor1, sensor2);
  return { v1: result.s1.velocity, v2: result.s2.velocity };
}
