/**
 * Constants.ts
 *
 * This file centralizes all physical, electromagnetic, astronomical,
 * simulation, and miscellaneous constants used throughout Quantum Sensor Sim.
 * It includes default values for sensors, simulation parameters, color palettes,
 * and domain-specific constants. Adjust these values to tune the simulation.
 */
export const Constants = {
  /* ============================= Physical Constants ============================= */

  /**
   * Gravitational Constant (G).
   * Defines the strength of the gravitational force between two masses:
   * F = G * (m1*m2) / r²
   * Unit: m³ kg⁻¹ s⁻²
   */
  GRAVITATIONAL_CONSTANT: 6.6743e-11,

  /**
   * Speed of Light in Vacuum.
   * The speed at which light propagates in a vacuum.
   * Unit: m/s
   */
  SPEED_OF_LIGHT: 299792458,

  /**
   * Planck's Constant.
   * Fundamental constant used in quantum mechanics.
   * Unit: J·s
   */
  PLANCK_CONSTANT: 6.62607015e-34,

  /**
   * Elementary Charge.
   * The electric charge carried by a single proton (or the negative of that by an electron).
   * Unit: C (Coulombs)
   */
  ELEMENTARY_CHARGE: 1.602176634e-19,

  /**
   * Boltzmann Constant.
   * Relates the average kinetic energy of particles in a gas with the temperature of the gas.
   * Unit: J/K
   */
  BOLTZMANN_CONSTANT: 1.380649e-23,

  /**
   * Stefan-Boltzmann Constant.
   * Used in the Stefan-Boltzmann law to determine the power radiated from a black body.
   * Unit: W/m²·K⁴
   */
  STEFAN_BOLTZMANN_CONSTANT: 5.670374419e-8,

  /* ========================= Electromagnetic Constants ========================= */

  /**
   * Coulomb's Constant.
   * Determines the electrostatic force between two charges:
   * F = K * (|q1*q2|) / r²
   * Unit: N·m²/C²
   */
  COULOMB_CONSTANT: 8.9875517923e9,

  /**
   * Permittivity of Free Space (ε₀).
   * Fundamental physical constant in electromagnetism.
   * Unit: F/m (Farads per meter)
   */
  PERMITTIVITY_OF_FREE_SPACE: 8.854187817e-12,

  /**
   * Permeability of Free Space (μ₀).
   * Measures the ability of a vacuum to support a magnetic field.
   * Unit: H/m (Henrys per meter)
   */
  PERMEABILITY_OF_FREE_SPACE: 1.2566370614e-6,

  /* =========================== Astronomical Constants =========================== */

  /**
   * Solar Mass.
   * The mass of the Sun.
   * Unit: kg
   */
  SOLAR_MASS: 1.98847e30,

  /**
   * Astronomical Unit (AU).
   * The average Earth-Sun distance.
   * Unit: m
   */
  ASTRONOMICAL_UNIT: 1.495978707e11,

  /**
   * Light Year.
   * The distance light travels in one year.
   * Unit: m
   */
  LIGHT_YEAR: 9.4607304725808e15,

  /* ======================= Simulation Defaults and Limits ======================= */

  /**
   * Default Sensor Mass.
   * The default mass assigned to sensors if none is specified.
   * Unit: kg
   */
  DEFAULT_SENSOR_MASS: 1.0,

  /**
   * Default Sensor Charge.
   * Sensors are neutral by default.
   * Unit: C (Coulombs)
   */
  DEFAULT_SENSOR_CHARGE: 0.0,

  /**
   * Default Sensor Radius.
   * The default radius for a sensor, used primarily in collision detection.
   * Unit: m
   */
  DEFAULT_SENSOR_RADIUS: 0.2,

  /**
   * Default Time Step for Simulation Updates.
   * Unit: s (seconds)
   */
  DEFAULT_TIME_STEP: 0.01,

  /**
   * Maximum Time Step allowed in the simulation.
   * Unit: s (seconds)
   */
  MAX_TIME_STEP: 1.0,

  /**
   * Minimum Time Step allowed in the simulation.
   * Unit: s (seconds)
   */
  MIN_TIME_STEP: 1e-6,

  /**
   * Default Emissivity.
   * Represents how efficiently a sensor radiates energy.
   * Dimensionless.
   */
  DEFAULT_EMISSIVITY: 0.9,

  /* ============================= Color Palettes ============================= */

  /**
   * Positive Color Palette.
   * An array of colors used to represent sensors with positive charge.
   */
  POSITIVE_COLOR_PALETTE: ['#FF4500', '#FF0000', '#FF6347'],

  /**
   * Negative Color Palette.
   * An array of colors used to represent sensors with negative charge.
   */
  NEGATIVE_COLOR_PALETTE: ['#1E90FF', '#00BFFF', '#87CEFA'],

  /**
   * Neutral Color.
   * The color assigned to sensors when their charge is zero.
   */
  NEUTRAL_COLOR: '#FFFFFF',

  /**
   * Maximum Sensor Charge.
   * The reference maximum charge used for normalizing sensor charge when computing color.
   */
  MAX_SENSOR_CHARGE: 10,

  /* ========================= Additional Domain Constants ========================= */

  /**
   * Speed of Sound in Air at Room Temperature.
   * Unit: m/s
   */
  SPEED_OF_SOUND: 343,

  /**
   * Earth Mass.
   * Unit: kg
   */
  EARTH_MASS: 5.972e24,

  /**
   * Earth Radius.
   * Unit: m
   */
  EARTH_RADIUS: 6.371e6,

  /* =================----------- Nuclear / Particle Physics =================----------- */

  /**
   * Electron Mass.
   * Unit: kg
   */
  ELECTRON_MASS: 9.10938356e-31,

  /**
   * Proton Mass.
   * Unit: kg
   */
  PROTON_MASS: 1.6726219e-27,

  /**
   * Neutron Mass.
   * Unit: kg
   */
  NEUTRON_MASS: 1.674927471e-27,

  /* =================-------- Thermodynamics / Statistical Mechanics =================-------- */

  /**
   * Ideal Gas Constant.
   * Unit: J/(mol·K)
   */
  IDEAL_GAS_CONSTANT: 8.314462618,

  /**
   * Avogadro's Number.
   * Unit: mol⁻¹
   */
  AVOGADRO_NUMBER: 6.02214076e23,

  /* ============================ Mathematical Constants ============================ */

  /**
   * Two Pi.
   * Represents 2π, useful in trigonometric calculations.
   */
  TWO_PI: Math.PI * 2,

  /* ============================ Benchmark Constants ============================ */
  /**
   * Number of Collisions to Benchmark.
   */
  BENCHMARK_EVENTS: 2097152,
  /**
   * Number of Sensors per Sphere to Benchmark.
   */
  BENCHMARK_SENSORS_PER_SPHERE: 8192,
  /**
   * Number of Network Spheres to Benchmark.
   */
  BENCHMARK_NETWORK_SPHERES: 6,
};

export type ConstantsType = typeof Constants;
