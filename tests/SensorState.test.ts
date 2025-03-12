/// <reference types="jest" />

import { SensorState } from '../src/sensors/SensorState';

describe('SensorState Enum', () => {
  test('should have correct state values', () => {
    expect(SensorState.ACTIVE).toEqual('active');
    expect(SensorState.INACTIVE).toEqual('inactive');
    expect(SensorState.MALFUNCTION).toEqual('malfunction');
    expect(SensorState.IDLE).toEqual('idle');
    expect(SensorState.MAINTENANCE).toEqual('maintenance');
    expect(SensorState.TRANSITION).toEqual('transition');
  });
});
