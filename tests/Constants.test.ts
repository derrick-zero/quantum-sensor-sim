import { Constants } from '../src/core/Constants';

describe('Constants Module Unit Tests', () => {
  test('Physical constants are defined correctly', () => {
    expect(Constants.GRAVITATIONAL_CONSTANT).toBeCloseTo(6.6743e-11, 15);
    expect(Constants.SPEED_OF_LIGHT).toBe(299792458);
    expect(Constants.PLANCK_CONSTANT).toBeCloseTo(6.62607015e-34, 40);
    expect(Constants.ELEMENTARY_CHARGE).toBeCloseTo(1.602176634e-19, 25);
    expect(Constants.BOLTZMANN_CONSTANT).toBeCloseTo(1.380649e-23, 28);
    expect(Constants.STEFAN_BOLTZMANN_CONSTANT).toBeCloseTo(5.670374419e-8, 15);
  });

  test('Electromagnetic constants are defined correctly', () => {
    expect(Constants.COULOMB_CONSTANT).toBeCloseTo(8.9875517923e9, 5);
    expect(Constants.PERMITTIVITY_OF_FREE_SPACE).toBeCloseTo(
      8.854187817e-12,
      20
    );
    expect(Constants.PERMEABILITY_OF_FREE_SPACE).toBeCloseTo(
      1.2566370614e-6,
      15
    );
  });

  test('Astronomical constants are defined correctly', () => {
    expect(Constants.SOLAR_MASS).toBeCloseTo(1.98847e30, 25);
    expect(Constants.ASTRONOMICAL_UNIT).toBeCloseTo(1.495978707e11, 5);
    expect(Constants.LIGHT_YEAR).toBeCloseTo(9.4607e15, 10);
  });

  test('Simulation constants are defined correctly', () => {
    expect(Constants.DEFAULT_SENSOR_MASS).toBe(1.0);
    expect(Constants.DEFAULT_SENSOR_CHARGE).toBe(0.0);
    expect(Constants.DEFAULT_TIME_STEP).toBe(0.01);
    expect(Constants.MAX_TIME_STEP).toBe(1.0);
    expect(Constants.MIN_TIME_STEP).toBe(1e-6);
    expect(Constants.DEFAULT_EMISSIVITY).toBe(0.9);
  });

  test('Mathematical constants are defined correctly', () => {
    expect(Constants.TWO_PI).toBeCloseTo(Math.PI * 2, 10);
  });
});
