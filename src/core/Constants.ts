/**
 * Contains physical constants and other constants used throughout the simulation.
 */
export const Constants = {
  // Physical Constants
  GRAVITATIONAL_CONSTANT: 6.6743e-11, // Gravitational constant, G (m³ kg⁻¹ s⁻²)
  SPEED_OF_LIGHT: 299792458, // Speed of light in vacuum, c (m s⁻¹)
  PLANCK_CONSTANT: 6.62607015e-34, // Planck constant, h (J s)
  ELEMENTARY_CHARGE: 1.602176634e-19, // Elementary charge, e (C)
  BOLTZMANN_CONSTANT: 1.380649e-23, // Boltzmann constant, k (J K⁻¹)
  STEFAN_BOLTZMANN_CONSTANT: 5.670374419e-8, // Stefan-Boltzmann constant, σ (W m⁻² K⁻⁴)

  // Electromagnetic Constants
  COULOMB_CONSTANT: 8.9875517923e9, // Coulomb's constant, k_e (N m² C⁻²)
  PERMITTIVITY_OF_FREE_SPACE: 8.854187817e-12, // Permittivity of free space, ε₀ (F m⁻¹)
  PERMEABILITY_OF_FREE_SPACE: 1.2566370614e-6, // Permeability of free space, μ₀ (N A⁻²)

  // Astronomical Constants
  SOLAR_MASS: 1.98847e30, // Solar mass, M☉ (kg)
  ASTRONOMICAL_UNIT: 1.495978707e11, // Astronomical unit, AU (m)
  LIGHT_YEAR: 9.4607e15, // Light-year (m)

  // Simulation Constants
  DEFAULT_SENSOR_MASS: 1.0, // Default mass for a sensor (kg)
  DEFAULT_SENSOR_CHARGE: 0.0, // Default charge for a sensor (C)
  DEFAULT_TIME_STEP: 0.01, // Default time step for simulation updates (s)
  MAX_TIME_STEP: 1.0, // Maximum allowable time step (s)
  MIN_TIME_STEP: 1e-6, // Minimum allowable time step (s)
  DEFAULT_EMISSIVITY: 0.9, // Default emissivity for blackbody radiation (dimensionless)

  // Mathematical Constants
  TWO_PI: Math.PI * 2, // 2π
};

export type ConstantsType = typeof Constants;
