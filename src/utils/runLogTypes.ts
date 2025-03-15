import { Sensor } from '../sensors/Sensor';

/**
 * RunEvent interface represents a simulation event to be logged during a run.
 */
export interface RunEvent {
  timestamp: number;
  event: 'collision' | 'impulse' | 'energyTransfer';
  sensors: Sensor[];
  preMomentum?: number;
  postMomentum?: number;
  preEnergy?: number;
  postEnergy?: number;
}
