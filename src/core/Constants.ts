/**
 * Contains physical, electromagnetic, astronomical, simulation, and additional
 * constants used throughout the simulation.
 */
export const Constants = {
  // Physical Constants
  GRAVITATIONAL_CONSTANT: 6.6743e-11, // m³ kg⁻¹ s⁻²
  SPEED_OF_LIGHT: 299792458, // m/s
  PLANCK_CONSTANT: 6.62607015e-34, // J s
  ELEMENTARY_CHARGE: 1.602176634e-19, // C
  BOLTZMANN_CONSTANT: 1.380649e-23, // J/K
  STEFAN_BOLTZMANN_CONSTANT: 5.670374419e-8, // W/(m² K⁴)

  // Electromagnetic Constants
  COULOMB_CONSTANT: 8.9875517923e9, // N m²/C²
  PERMITTIVITY_OF_FREE_SPACE: 8.854187817e-12, // F/m
  PERMEABILITY_OF_FREE_SPACE: 1.2566370614e-6, // H/m

  // Astronomical Constants
  SOLAR_MASS: 1.98847e30, // kg
  ASTRONOMICAL_UNIT: 1.495978707e11, // m
  LIGHT_YEAR: 9.4607304725808e15, // m

  // Simulation Defaults and Limits
  DEFAULT_SENSOR_MASS: 1.0, // kg
  DEFAULT_SENSOR_CHARGE: 0.0, // C (neutral)
  DEFAULT_SENSOR_RADIUS: 0.2, // m
  DEFAULT_TIME_STEP: 0.01, // s
  MAX_TIME_STEP: 1.0, // s
  MIN_TIME_STEP: 1e-6, // s
  DEFAULT_EMISSIVITY: 0.9, // dimensionless

  // Additional Constants: Acoustics, etc.
  SPEED_OF_SOUND: 343, // m/s in air at room temperature

  // Gravitational (Earth-specific) Constants
  EARTH_MASS: 5.972e24, // kg
  EARTH_RADIUS: 6.371e6, // m

  // Nuclear / Particle Physics
  ELECTRON_MASS: 9.10938356e-31, // kg
  PROTON_MASS: 1.6726219e-27, // kg
  NEUTRON_MASS: 1.674927471e-27, // kg

  // Thermodynamics / Statistical Mechanics
  IDEAL_GAS_CONSTANT: 8.314462618, // J/(mol·K)
  AVOGADRO_NUMBER: 6.02214076e23, // mol⁻¹

  // Color Palette for Sensors (six quark colors plus black and white).
  // Colors arranged from cool (cold extreme) to hot (heat extreme).
  DEFAULT_COLOR_PALETTE: [
    '#000000', // Black
    '#0000FF', // Blue
    '#00FFFF', // Cyan
    '#00FF00', // Green
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#FF0000', // Red
    '#FFFFFF', // White
  ],

  // Mathematical Constants
  TWO_PI: Math.PI * 2,
};

export type ConstantsType = typeof Constants;
