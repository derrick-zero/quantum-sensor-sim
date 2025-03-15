# Quantum Sensor Sim

Quantum Sensor Sim is a comprehensive simulation platform designed to model various physical phenomena using sensors. It simulates individual sensor dynamics, hierarchical sensor spheres and networks, and provides a foundation for exploring emergent behaviors through advanced physics and visualization techniques.

## Overview

Quantum Sensor Sim provides a cutting-edge framework for simulating:

- **Sensor Dynamics:**
  Each sensor has physical properties (mass, charge, radius, spin, etc.) and computes its display color based on a deterministic, continuous HSL mapping.
- **Sensor Spheres:**
  Sensors are grouped into sensor spheres that further compute an overall color based on the average sensor charge. Spheres support various dynamic behaviors including rotation, vibration, collisions, and impulse interactions.
- **Simulation Engine:**
  A robust engine orchestrates sensor and sphere updates, handles collisions and container boundaries, and supports features such as reset (with an option to restart automatically), randomization, and time reversal.
- **Interactive Visual Demo:**
  The demo is built with Three.js and includes live GUI controls (via lil‑gui) for adjusting simulation parameters in real time (e.g., time step, impulse strength, sensor charge offset, reset toggle). A debug overlay displays runtime information such as the average sensor charge and the computed sphere color.

## Key Features

- **Modular Architecture:**
  - _Sensors_: Individual sensor entities with continuous color mapping.
  - _Sensor Spheres_: Aggregated sensors that determine an overall visual state.
  - _Simulation Engine_: Central coordinator for updates, collisions, resets, and simulation behavior adjustments.
- **Dynamic Visualizations:**
  - Real-time rendering using Three.js.
  - GUI controls to adjust and observe dynamic simulation parameters.
  - Debug overlay showing average sensor charge and computed colors.
- **Robust Testing and Quality:**
  - Nearly 100% test coverage using Jest and Cypress.
  - Comprehensive unit and integration tests.
  - Continuous integration ensuring linting and type-quality.
- **Reset & Restart Toggle:**
  - The simulation reset now stops the simulation, resets all state, and then automatically restarts (or not, based on a GUI toggle).

## Architecture

### Core Modules

- **Constants.ts:**
  Contains all physical constants, simulation default values, and color palette configurations.
- **Logger.ts:**
  A configurable logging module with support for multiple log levels (DEBUG, INFO, etc.). It logs both to the console and (optionally) to files.
- **Vector3.ts:**
  Implements 3D vector arithmetic and spatial operations which underpin the simulation.

### Simulation Modules

- **Sensor.ts:**
  Defines sensor entities with properties such as position, velocity, charge, and a computed display color using continuous HSL interpolation. Also includes placeholders for dynamic behaviors (vibration, rotation, wobble, radiation).
- **SensorSphere.ts:**
  Groups sensors using a uniform spherical distribution. Sensors within the sphere are initialized with a random charge chosen from a set of three possibilities (neutral, positive, or negative) for roughly one-third chance each. The sphere computes its overall color from the average sensor charge.
- **SimulationEngine.ts:**
  Orchestrates the simulation by updating sensors and sensor spheres, processing collisions, enforcing container boundaries, and supporting controls such as reset-and-restart, randomization, and time reversal.

### Domain-Specific Modules

- **ElectricField.ts, GravitySimulator.ts, MagneticField.ts:**
  Contain simulation logic for specific physical phenomena.

### Visual Demo

- **app.ts:**
  Sets up the Three.js scene, instantiates the simulation engine, renders sensor and sensor sphere meshes, and creates a live GUI dashboard (using lil‑gui) to control simulation parameters. New GUI controls include:
  - **Reset & Restart Toggle:** Choose whether a reset automatically resumes the simulation.
  - **Charge Offset Slider:** Adjusts sensor charges in real time, updating sensor and sphere colors.
  - **Debug Overlay:** Displays runtime information such as average sensor charge and computed sphere color.
- **app.cy.ts:**
  Contains end-to-end tests (using Cypress) verifying that the interactive visual demo works as expected.

## Setup Instructions

### Prerequisites

- **Node.js and npm:**
  Ensure you have Node.js (v14+) and npm installed. Download from [Node.js](https://nodejs.org/).

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/derrick-zero/quantum-sensor-sim.git
   cd quantum-sensor-sim
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Build the Project:**

   ```bash
   npm run build
   ```

   - Pre-build step (automatic):

   ```bash
   npm run prebuild
   ```

   _clean build caches, format with Prettier, lint with ESLint, generate docs with TypeDoc_

   - Post-build step (automatic):

   ```bash
   npm run postbuild
   ```

   _run automated tests_

4. **Run Tests:**
   - Unit Tests:
     ```bash
     npm run test
     ```
   - End-to-End Tests (Cypress):
     ```bash
     npm run test:e2e
     ```

### Running the Visual Demo

1. **Start the Development Server:**
   ```bash
   npm start
   ```
2. **Open the Demo in Your Browser:**
   Navigate to [http://localhost:1234](http://localhost:1234).

## Usage

When you open the demo, you will see:

- **Interactive GUI Controls:**
  - **Time Step:** Change the simulation update rate.
  - **Impulse Strength:** Control the strength of impulses applied via mouse clicks.
  - **Reset & Restart Toggle:** Choose whether resetting the simulation automatically restarts it.
  - **Charge Offset Slider:** Adjust the sensor charge offset in real time—this updates sensor colors and, consequently, the sensor sphere's color.
- **Debug Overlay:**
  Displays live information, such as the average sensor charge and the computed sensor sphere color.
- **User Interaction:**
  Click on the canvas to apply impulses.

## Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines on reporting issues, submitting pull requests, and our coding standards.

## Roadmap

- **Multi-Sensor Sphere Dynamics:**
  Enhance interactions among sensor spheres and refine collision handling.
- **Advanced Physics:**
  Expand gravitational, electric, and magnetic simulations.
- **Performance Optimizations:**
  Implement spatial partitioning and other optimizations.
- **VR / WebXR Integration:**
  Develop an immersive simulation experience.
- **Extended Debug Tools:**
  Add more runtime overlays and logging options.

## Documentation

- API documentation is generated via TypeDoc and is available in the `docs/` directory.
- Detailed guides and examples are provided in the project wiki (if applicable).

## Recommended Tools

For optimum development experience, install these VS Code extensions:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code Formatter** (`esbenp.prettier-vscode`)
- **Jest** (`orta.vscode-jest`)
- **TypeScript and JavaScript Language Features** (`ms-vscode.vscode-typescript-tslint-plugin`)
- **Edge DevTools for VS Code** (`ms-edgedevtools.vscode-edge-devtools`)

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open a GitHub issue or contact [derrick.geiszler@gmail.com](mailto:derrick.geiszler@gmail.com).
