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
 * This method is computationally efficient because it uses direct analytical calculations
 * rather than iterative adjustments, and ensures both momentum and energy conservation.
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
