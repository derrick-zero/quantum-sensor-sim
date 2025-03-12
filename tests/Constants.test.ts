/// <reference types="jest" />
import { Constants } from '../src/core/Constants';

describe('Constants', () => {
  test('Physical constants are defined correctly', () => {
    expect(Constants.GRAVITATIONAL_CONSTANT).toBeCloseTo(6.6743e-11);
    expect(Constants.SPEED_OF_LIGHT).toBe(299792458);
    expect(Constants.PLANCK_CONSTANT).toBeCloseTo(6.62607015e-34);
    expect(Constants.ELEMENTARY_CHARGE).toBeCloseTo(1.602176634e-19);
    expect(Constants.BOLTZMANN_CONSTANT).toBeCloseTo(1.380649e-23);
    expect(Constants.STEFAN_BOLTZMANN_CONSTANT).toBeCloseTo(5.670374419e-8);
  });

  test('Electromagnetic constants are defined correctly', () => {
    expect(Constants.COULOMB_CONSTANT).toBeCloseTo(8.9875517923e9);
    expect(Constants.PERMITTIVITY_OF_FREE_SPACE).toBeCloseTo(8.854187817e-12);
    expect(Constants.PERMEABILITY_OF_FREE_SPACE).toBeCloseTo(1.2566370614e-6);
  });

  test('Astronomical constants are defined correctly', () => {
    expect(Constants.SOLAR_MASS).toBeCloseTo(1.98847e30);
    expect(Constants.ASTRONOMICAL_UNIT).toBeCloseTo(1.495978707e11);
    expect(Constants.LIGHT_YEAR).toBeCloseTo(9.4607304725808e15);
  });

  test('Simulation defaults and limits are set correctly', () => {
    expect(Constants.DEFAULT_SENSOR_MASS).toEqual(1.0);
    expect(Constants.DEFAULT_SENSOR_CHARGE).toEqual(0.0);
    expect(Constants.DEFAULT_SENSOR_RADIUS).toEqual(0.2);
    expect(Constants.DEFAULT_TIME_STEP).toEqual(0.01);
    expect(Constants.MAX_TIME_STEP).toEqual(1.0);
    expect(Constants.MIN_TIME_STEP).toEqual(1e-6);
    expect(Constants.DEFAULT_EMISSIVITY).toEqual(0.9);
  });

  test('Color palettes and neutral color are set correctly', () => {
    expect(Constants.POSITIVE_COLOR_PALETTE).toEqual([
      '#FF4500',
      '#FF0000',
      '#FF6347',
    ]);
    expect(Constants.NEGATIVE_COLOR_PALETTE).toEqual([
      '#1E90FF',
      '#00BFFF',
      '#87CEFA',
    ]);
    expect(Constants.NEUTRAL_COLOR).toEqual('#FFFFFF');
  });

  test('Additional domain constants are defined correctly', () => {
    expect(Constants.SPEED_OF_SOUND).toEqual(343);
    expect(Constants.EARTH_MASS).toBeCloseTo(5.972e24);
    expect(Constants.EARTH_RADIUS).toBeCloseTo(6.371e6);
  });

  test('Nuclear and thermodynamic related constants are defined correctly', () => {
    expect(Constants.ELECTRON_MASS).toBeCloseTo(9.10938356e-31);
    expect(Constants.PROTON_MASS).toBeCloseTo(1.6726219e-27);
    expect(Constants.NEUTRON_MASS).toBeCloseTo(1.674927471e-27);
    expect(Constants.IDEAL_GAS_CONSTANT).toBeCloseTo(8.314462618);
    expect(Constants.AVOGADRO_NUMBER).toBeCloseTo(6.02214076e23);
  });

  test('Mathematical constants are defined correctly', () => {
    expect(Constants.TWO_PI).toBeCloseTo(Math.PI * 2);
  });
});
