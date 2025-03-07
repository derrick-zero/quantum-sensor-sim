import { Constants } from '../src/core/Constants';

describe('Constants Module Unit Tests', () => {
  test('Physical Constants are set correctly', () => {
    expect(Constants.GRAVITATIONAL_CONSTANT).toBeCloseTo(6.6743e-11);
    expect(Constants.SPEED_OF_LIGHT).toBe(299792458);
    expect(Constants.PLANCK_CONSTANT).toBeCloseTo(6.62607015e-34);
    expect(Constants.ELEMENTARY_CHARGE).toBeCloseTo(1.602176634e-19);
    expect(Constants.BOLTZMANN_CONSTANT).toBeCloseTo(1.380649e-23);
    expect(Constants.STEFAN_BOLTZMANN_CONSTANT).toBeCloseTo(5.670374419e-8);
  });

  test('Electromagnetic Constants are set correctly', () => {
    expect(Constants.COULOMB_CONSTANT).toBeCloseTo(8.9875517923e9);
    expect(Constants.PERMITTIVITY_OF_FREE_SPACE).toBeCloseTo(8.854187817e-12);
    expect(Constants.PERMEABILITY_OF_FREE_SPACE).toBeCloseTo(1.2566370614e-6);
  });

  test('Astronomical Constants are set correctly', () => {
    expect(Constants.SOLAR_MASS).toBeCloseTo(1.98847e30);
    expect(Constants.ASTRONOMICAL_UNIT).toBeCloseTo(1.495978707e11);
    expect(Constants.LIGHT_YEAR).toBeCloseTo(9.4607304725808e15);
  });

  test('Simulation Defaults and Limits are correct', () => {
    expect(Constants.DEFAULT_SENSOR_MASS).toBe(1.0);
    expect(Constants.DEFAULT_SENSOR_CHARGE).toBe(0.0);
    expect(Constants.DEFAULT_SENSOR_RADIUS).toBe(0.2);
    expect(Constants.DEFAULT_TIME_STEP).toBe(0.01);
    expect(Constants.MAX_TIME_STEP).toBe(1.0);
    expect(Constants.MIN_TIME_STEP).toBe(1e-6);
    expect(Constants.DEFAULT_EMISSIVITY).toBe(0.9);
  });

  test('Additional Constants are defined correctly', () => {
    expect(Constants.SPEED_OF_SOUND).toBe(343);
    expect(Constants.EARTH_MASS).toBeCloseTo(5.972e24);
    expect(Constants.EARTH_RADIUS).toBeCloseTo(6.371e6);
    expect(Constants.ELECTRON_MASS).toBeCloseTo(9.10938356e-31);
    expect(Constants.PROTON_MASS).toBeCloseTo(1.6726219e-27);
    expect(Constants.NEUTRON_MASS).toBeCloseTo(1.674927471e-27);
    expect(Constants.IDEAL_GAS_CONSTANT).toBeCloseTo(8.314462618);
    expect(Constants.AVOGADRO_NUMBER).toBeCloseTo(6.02214076e23);
  });

  test('DEFAULT_COLOR_PALETTE is correct', () => {
    expect(Array.isArray(Constants.DEFAULT_COLOR_PALETTE)).toBe(true);
    expect(Constants.DEFAULT_COLOR_PALETTE.length).toBe(8);
    expect(Constants.DEFAULT_COLOR_PALETTE[0]).toBe('#000000');
    expect(Constants.DEFAULT_COLOR_PALETTE[7]).toBe('#FFFFFF');
  });

  test('TWO_PI is correctly defined', () => {
    expect(Constants.TWO_PI).toBeCloseTo(Math.PI * 2);
  });
});
