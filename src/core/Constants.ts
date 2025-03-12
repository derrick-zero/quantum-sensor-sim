/**
 * Constants.ts
 *
 * This file centralizes all constants used throughout the Quantum Sensor Sim project.
 * It includes physical constants, electromagnetic and astronomical values, simulation defaults,
 * color palettes for dynamic sensor visualization, and domain-specific values (acoustics, nuclear, etc.).
 *
 * Each constant is defined with appropriate units and documentation. This ensures consistency across the project
 * and makes it easy to adjust values for tuning or extending the simulation.
 */
export const Constants = {
  /* ============================= Physical Constants ============================= */
  // Gravitational constant, G (m³ kg⁻¹ s⁻²)
  GRAVITATIONAL_CONSTANT: 6.6743e-11,
  // Speed of light in vacuum, c (m/s)
  SPEED_OF_LIGHT: 299792458,
  // Planck constant, h (J·s)
  PLANCK_CONSTANT: 6.62607015e-34,
  // Elementary charge, e (C)
  ELEMENTARY_CHARGE: 1.602176634e-19,
  // Boltzmann constant, k (J/K)
  BOLTZMANN_CONSTANT: 1.380649e-23,
  // Stefan-Boltzmann constant, σ (W/m²·K⁴)
  STEFAN_BOLTZMANN_CONSTANT: 5.670374419e-8,

  /* ========================= Electromagnetic Constants ========================= */
  // Coulomb's constant, kₑ (N·m²/C²)
  COULOMB_CONSTANT: 8.9875517923e9,
  // Permittivity of free space, ε₀ (F/m)
  PERMITTIVITY_OF_FREE_SPACE: 8.854187817e-12,
  // Permeability of free space, μ₀ (H/m)
  PERMEABILITY_OF_FREE_SPACE: 1.2566370614e-6,

  /* =========================== Astronomical Constants =========================== */
  // Solar mass, M☉ (kg)
  SOLAR_MASS: 1.98847e30,
  // Astronomical Unit, AU (m)
  ASTRONOMICAL_UNIT: 1.495978707e11,
  // One light-year (m)
  LIGHT_YEAR: 9.4607304725808e15,

  /* ======================= Simulation Defaults and Limits ======================= */
  // Default sensor mass (kg)
  DEFAULT_SENSOR_MASS: 1.0,
  // Default sensor charge (C), 0 means neutral.
  DEFAULT_SENSOR_CHARGE: 0.0,
  // Default sensor collision radius (m)
  DEFAULT_SENSOR_RADIUS: 0.2,
  // Default time step for simulation updates (s)
  DEFAULT_TIME_STEP: 0.01,
  // Maximum and minimum allowable time steps (s)
  MAX_TIME_STEP: 1.0,
  MIN_TIME_STEP: 1e-6,
  // Default emissivity for sensors (dimensionless)
  DEFAULT_EMISSIVITY: 0.9,

  /* ============================= Color Palettes ============================= */
  // Color palette for sensors with positive charge ("hot" colors)
  POSITIVE_COLOR_PALETTE: ['#FF4500', '#FF0000', '#FF6347'],
  // Color palette for sensors with negative charge ("cold" colors)
  NEGATIVE_COLOR_PALETTE: ['#1E90FF', '#00BFFF', '#87CEFA'],
  // Neutral sensor color - changed to white for better visibility on a dark background
  NEUTRAL_COLOR: '#FFFFFF',

  /* ========================= Additional Domain Constants ========================= */
  // Acoustics: Speed of sound in air at room temperature (m/s)
  SPEED_OF_SOUND: 343,

  // Gravitational (Earth-specific) Constants:
  EARTH_MASS: 5.972e24, // in kg
  EARTH_RADIUS: 6.371e6, // in m

  // Nuclear / Particle Physics:
  ELECTRON_MASS: 9.10938356e-31, // in kg
  PROTON_MASS: 1.6726219e-27, // in kg
  NEUTRON_MASS: 1.674927471e-27, // in kg

  // Thermodynamics / Statistical Mechanics:
  IDEAL_GAS_CONSTANT: 8.314462618, // J/(mol·K)
  AVOGADRO_NUMBER: 6.02214076e23, // mol⁻¹

  /* ============================ Mathematical Constants ============================ */
  TWO_PI: Math.PI * 2,
};

export type ConstantsType = typeof Constants;
