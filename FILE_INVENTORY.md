# FILE_INVENTORY.md

### Core and Utility Modules

1. [src/core/Constants.ts](src/core/Constants.ts)
2. [tests/Constants.test.ts](tests/Constants.test.ts)
3. [src/core/Logger.ts](src/core/Logger.ts)
4. [tests/Logger.test.ts](tests/Logger.test.ts)
5. [src/core/Utils.ts](src/core/Utils.ts)
6. [tests/Utils.test.ts](tests/Utils.test.ts)
7. [src/core/Vector3.ts](src/core/Vector3.ts)
8. [tests/Vector3.test.ts](tests/Vector3.test.ts)

### Sensor Modules

9. [src/sensors/SensorState.ts](src/sensors/SensorState.ts)
10. [tests/SensorState.test.ts](tests/SensorState.test.ts)
11. [src/sensors/Sensor.ts](src/sensors/Sensor.ts)
12. [tests/Sensor.test.ts](tests/Sensor.test.ts)
13. [src/sensors/SensorSphere.ts](src/sensors/SensorSphere.ts)
14. [tests/SensorSphere.test.ts](tests/SensorSphere.test.ts)
15. [src/sensors/SensorSphereNetwork.ts](src/sensors/SensorSphereNetwork.ts)
16. [tests/SensorSphereNetwork.test.ts](tests/SensorSphereNetwork.test.ts)

### Simulation and Engine Modules

17. [src/SimulationEngine.ts](src/SimulationEngine.ts)
18. [tests/SimulationEngine.test.ts](tests/SimulationEngine.test.ts)

### Physics Modules

#### Gravity & Electricity

19. [src/gravity/GravitySimulator.ts](src/gravity/GravitySimulator.ts)
20. [tests/GravitySimulator.test.ts](tests/GravitySimulator.test.ts)
21. [src/electricity/ElectricField.ts](src/electricity/ElectricField.ts)
22. [tests/ElectricField.test.ts](tests/ElectricField.test.ts)

#### Electromagnetic Waves

23. [src/electromagnetic_waves/FaradayLaw.ts](src/electromagnetic_waves/FaradayLaw.ts)
24. [tests/FaradayLaw.test.ts](tests/FaradayLaw.test.ts)
25. [src/electromagnetic_waves/HertzianWaves.ts](src/electromagnetic_waves/HertzianWaves.ts)
26. [tests/HertzianWaves.test.ts](tests/HertzianWaves.test.ts)
27. [src/electromagnetic_waves/PlanckLaw.ts](src/electromagnetic_waves/PlanckLaw.ts)
28. [tests/PlanckLaw.test.ts](tests/PlanckLaw.test.ts)

#### Magnetism

29. [src/magnetism/MagneticField.ts](src/magnetism/MagneticField.ts)
30. [tests/MagneticField.test.ts](tests/MagneticField.test.ts)
31. [src/magnetism/MagnetismSimulator.ts](src/magnetism/MagnetismSimulator.ts)
32. [tests/MagnetismSimulator.test.ts](tests/MagnetismSimulator.test.ts)

#### Neutrinos

33. [src/neutrinos/Neutrino.ts](src/neutrinos/Neutrino.ts)
34. [tests/Neutrino.test.ts](tests/Neutrino.test.ts)
35. [src/neutrinos/NeutrinoInteractions.ts](src/neutrinos/NeutrinoInteractions.ts)
36. [tests/NeutrinoInteractions.test.ts](tests/NeutrinoInteractions.test.ts)
37. [src/neutrinos/NeutrinoSimulator.ts](src/neutrinos/NeutrinoSimulator.ts)
38. [tests/NeutrinoSimulator.test.ts](tests/NeutrinoSimulator.test.ts)

#### Nuclear Physics

39. [src/nuclear_physics/NuclearFissionFusion.ts](src/nuclear_physics/NuclearFissionFusion.ts)
40. [tests/NuclearFissionFusion.test.ts](tests/NuclearFissionFusion.test.ts)
41. [src/nuclear_physics/ParticleInteractions.ts](src/nuclear_physics/ParticleInteractions.ts)
42. [tests/ParticleInteractions.test.ts](tests/ParticleInteractions.test.ts)
43. [src/nuclear_physics/RadioactiveDecay.ts](src/nuclear_physics/RadioactiveDecay.ts)
44. [tests/RadioactiveDecay.test.ts](tests/RadioactiveDecay.test.ts)

#### Acoustics

45. [src/acoustics/AcousticDopplerEffect.ts](src/acoustics/AcousticDopplerEffect.ts)
46. [tests/AcousticDopplerEffect.test.ts](tests/AcousticDopplerEffect.test.ts)
47. [src/acoustics/HarmonicOscillators.ts](src/acoustics/HarmonicOscillators.ts)
48. [tests/HarmonicOscillators.test.ts](tests/HarmonicOscillators.test.ts)
49. [src/acoustics/SoundWaves.ts](src/acoustics/SoundWaves.ts)
50. [tests/SoundWaves.test.ts](tests/SoundWaves.test.ts)

#### Optics

51. [src/optics/DiffractionPolarization.ts](src/optics/DiffractionPolarization.ts)
52. [tests/DiffractionPolarization.test.ts](tests/DiffractionPolarization.test.ts)
53. [src/optics/LensMirrorEquations.ts](src/optics/LensMirrorEquations.ts)
54. [tests/LensMirrorEquations.test.ts](tests/LensMirrorEquations.test.ts)
55. [src/optics/SnellLaw.ts](src/optics/SnellLaw.ts)
56. [tests/SnellLaw.test.ts](tests/SnellLaw.test.ts)

#### Photons

57. [src/photons/ElectromagneticWave.ts](src/photons/ElectromagneticWave.ts)
58. [tests/ElectromagneticWave.test.ts](tests/ElectromagneticWave.test.ts)
59. [src/photons/Photon.ts](src/photons/Photon.ts)
60. [tests/Photon.test.ts](tests/Photon.test.ts)
61. [src/photons/PhotonSimulator.ts](src/photons/PhotonSimulator.ts)
62. [tests/PhotonSimulator.test.ts](tests/PhotonSimulator.test.ts)

---

### Integration, Advanced Physics, and Other Modules

63. [src/plasma_physics/DebyeShielding.ts](src/plasma_physics/DebyeShielding.ts)
64. [tests/DebyeShielding.test.ts](tests/DebyeShielding.test.ts)
65. [src/plasma_physics/Magnetohydrodynamics.ts](src/plasma_physics/Magnetohydrodynamics.ts)
66. [tests/Magnetohydrodynamics.test.ts](tests/Magnetohydrodynamics.test.ts)
67. [src/plasma_physics/PlasmaOscillations.ts](src/plasma_physics/PlasmaOscillations.ts)
68. [tests/PlasmaOscillations.test.ts](tests/PlasmaOscillations.test.ts)
69. [src/statistical_mechanics/BoltzmannDistribution.ts](src/statistical_mechanics/BoltzmannDistribution.ts)
70. [tests/BoltzmannDistribution.test.ts](tests/BoltzmannDistribution.test.ts)
71. [src/statistical_mechanics/PartitionFunction.ts](src/statistical_mechanics/PartitionFunction.ts)
72. [tests/PartitionFunction.test.ts](tests/PartitionFunction.test.ts)
73. [src/statistical_mechanics/ThermodynamicPotentials.ts](src/statistical_mechanics/ThermodynamicPotentials.ts)
74. [tests/ThermodynamicPotentials.test.ts](tests/ThermodynamicPotentials.test.ts)
75. [src/thermodynamics/CarnotCycle.ts](src/thermodynamics/CarnotCycle.ts)
76. [tests/CarnotCycle.test.ts](tests/CarnotCycle.test.ts)
77. [src/thermodynamics/HeatTransfer.ts](src/thermodynamics/HeatTransfer.ts)
78. [tests/HeatTransfer.test.ts](tests/HeatTransfer.test.ts)
79. [src/thermodynamics/ThermodynamicLaws.ts](src/thermodynamics/ThermodynamicLaws.ts)
80. [tests/ThermodynamicLaws.test.ts](tests/ThermodynamicLaws.test.ts)
81. [src/wave_mechanics/SchrodingerEquation.ts](src/wave_mechanics/SchrodingerEquation.ts)
82. [tests/SchrodingerEquation.test.ts](tests/SchrodingerEquation.test.ts)
83. [src/wave_mechanics/WaveInterference.ts](src/wave_mechanics/WaveInterference.ts)
84. [tests/WaveInterference.test.ts](tests/WaveInterference.test.ts)
85. [src/wave_mechanics/WaveParticleDuality.ts](src/wave_mechanics/WaveParticleDuality.ts)
86. [tests/WaveParticleDuality.test.ts](tests/WaveParticleDuality.test.ts)

---

### Integration, Application, and Configuration Files

87. [cypress/e2e/app.cy.ts](cypress/e2e/app.cy.ts)
88. [src/app.ts](src/app.ts)
89. [index.html](index.html)
90. [package.json](package.json)
91. [tsconfig.json](tsconfig.json)
92. [cypress.config.js](cypress.config.js)
93. [.gitignore](.gitignore)
94. [.eslintignore](.eslintignore)
95. [QuantumSensorSim.code-workspace](QuantumSensorSim.code-workspace)

---

### Documentation and Project Metadata

96. [README.md](README.md)
97. [API_REFERENCE.md](docs/API_REFERENCE.md)
98. [TECH_STACK.md](docs/TECH_STACK.md)
99. [CONTRIBUTING.md](docs/CONTRIBUTING.md)
100.  [FILE_INVENTORY.md](FILE_INVENTORY.md)
101.  [ROADMAP.md](ROADMAP.md)
102.  [LICENSE](LICENSE)
