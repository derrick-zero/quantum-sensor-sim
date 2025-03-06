/**
 * Enum representing the various states that a sensor can assume within the simulation.
 *
 * This simple enum approach guarantees type safety across the codebase,
 * ensuring that only valid states are used. As the simulation evolves, additional
 * states may be introduced or more complex state management (such as state machines)
 * can be adopted.
 */
export enum SensorState {
  /**
   * Sensor is fully operational and actively processing data.
   */
  ACTIVE = 'active',

  /**
   * Sensor is turned off or deactivated, hence not processing any data.
   */
  INACTIVE = 'inactive',

  /**
   * Sensor has encountered an error and is not functioning as expected.
   */
  MALFUNCTION = 'malfunction',

  /**
   * Sensor is in an idle mode; it is powered on but not performing any active measurements.
   */
  IDLE = 'idle',

  /**
   * Sensor is undergoing maintenance or calibration.
   */
  MAINTENANCE = 'maintenance',

  /**
   * Sensor is in a transient state (e.g., transitioning between states).
   * This value can help identify sensors that are in the process of switching behaviors.
   */
  TRANSITION = 'transition',
}
