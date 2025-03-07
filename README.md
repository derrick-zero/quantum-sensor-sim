# Quantum Sensor Sim

## Overview

Quantum Sensor Sim is a comprehensive simulation platform for modeling various physical phenomena using sensors. It aims to simulate individual sensor dynamics, sensor spheres, sensor sphere networks, and sensor network lattices—providing a foundation for exploring emergent behaviors in a digital environment that blends physics, simulation, and advanced visualization.

## Features

- **Modular Simulation Engine:**

  - Models sensors with individual properties such as mass, charge, radius, spin, and color.
  - Groups sensors into sensor spheres, simulating hierarchical physical systems.
  - Supports dynamic behaviors including vibration, rotation, wobble, collisions, and impulse-based interactions.
  - Includes advanced controls for resetting, randomizing, and even time reversal of the simulation.

- **Interactive Visual Demo:**
  - Built with Three.js, displaying real-time sensor dynamics.
  - Uses lil-gui for live parameter adjustments (time step, impulse strength, container settings, etc.).
  - Incorporates raycasting for user input (e.g., “bumping” sensor spheres with mouse clicks).

## Setup Instructions

### Prerequisites

1. **Node.js and npm:**
   Ensure you have Node.js and npm installed on your machine. Download from [Node.js](https://nodejs.org/).

### Installing Node.js and npm

1. **Download Node.js and npm:**
   Visit the [Node.js download page](https://nodejs.org/) and download the installer for your operating system.
2. **Run the Installer:**
   Follow the installation instructions to install both Node.js and npm.
3. **Verify Installation:**
   Open your terminal or command prompt and run:
   ```bash
   node -v
   npm -v
   ```

### Cloning the Repository

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/derrick-zero/quantum-sensor-sim
   cd quantum-sensor-sim
   ```

### Installing Dependencies

1. **Install npm Packages:**
   ```bash
   npm install
   ```

### Building the Project

1. **Build the Project:**
   ```bash
   npm run build
   ```

### Running Tests

1. **Run Unit Tests:**
   ```bash
   npm test
   ```
2. **Run Integration/End-to-End Tests:**
   ```bash
   npm run test:e2e
   ```

### Running the Visual Demo

1. **Start the Development Server:**
   ```bash
   npm start
   ```
2. **Open the Demo:**
   Navigate to [http://localhost:1234](http://localhost:1234) in your browser.

### Recommended VS Code Extensions

To improve your development experience in VS Code, install the following extensions:

- **ESLint** (`dbaeumer.vscode-eslint`): Integrates ESLint to identify and fix linting issues.
- **Prettier - Code Formatter** (`esbenp.prettier-vscode`): Ensures consistent code formatting.
- **Jest** (`orta.vscode-jest`): Provides integration with Jest for running tests and showing results.
- **TypeScript and JavaScript Language Features** (`ms-vscode.vscode-typescript-tslint-plugin`): Offers enhanced IntelliSense and syntax highlighting.
- **Edge DevTools for VS Code** (`ms-edgedevtools.vscode-edge-devtools`): Helps debug JavaScript using the Edge developer tools.

### Configuring VS Code Extensions

#### ESLint Configuration

1. Install the ESLint extension (`dbaeumer.vscode-eslint`).
2. Ensure you have an ESLint configuration file (`.eslintrc.json`) in the project root.
3. In your VS Code workspace settings, add:
   ```json
   {
     "eslint.enable": true,
     "eslint.options": {
       "configFile": ".eslintrc.json"
     },
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

#### Prettier Configuration

1. Install the Prettier extension (`esbenp.prettier-vscode`).
2. Ensure you have a Prettier configuration file (`.prettierrc`) in the project root.
3. In your VS Code workspace settings, add:
   ```json
   {
     "editor.formatOnSave": true,
     "prettier.requireConfig": true
   }
   ```

#### Jest Configuration

1. Install the Jest extension (`orta.vscode-jest`).
2. Ensure you have a Jest configuration file (`jest.config.js`) in the project root.
3. In your VS Code workspace settings, add:
   ```json
   {
     "jest.enableCodeLens": true,
     "jest.autoRun": "off",
     "jest.runAllTestsFirst": true,
     "jest.showCoverageOnLoad": true
   }
   ```

### CLI Commands for Setup

#### Installing npm Packages

```bash
npm install typescript jest ts-jest @types/jest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier ts-node nodemon husky lint-staged @commitlint/config-conventional @commitlint/cli --save-dev
```

#### Configuring Husky and lint-staged

Add the following to your **package.json**:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npx lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write", "git add"]
  }
}
```

#### Installing VS Code Extensions

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension orta.vscode-jest
code --install-extension ms-vscode.vscode-typescript-tslint-plugin
code --install-extension ms-edgedevtools.vscode-edge-devtools
```

### Git Commands

- **Clone the Repository:**

  ```bash
  git clone https://github.com/derrick-zero/quantum-sensor-sim
  cd quantum-sensor-sim
  ```

- **Create a New Branch:**

  ```bash
  git checkout -b <branch-name>
  ```

- **Stage and Commit Changes:**

  ```bash
  git add .
  git commit -m "Commit message"
  ```

- **Push Changes:**

  ```bash
  git push origin <branch-name>
  ```

- **Create a Pull Request:**
  Navigate to the GitHub repository's "Pull requests" tab and create a new pull request with a clear description.

### Usage

- Detailed API documentation is available in the `docs/API_REFERENCE.md` file.

### Contributing

- See `docs/CONTRIBUTING.md` for contribution guidelines.

### License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
