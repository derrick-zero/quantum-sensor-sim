# Quantum Sensor Sim

## Overview

Quantum Sensor Sim is a comprehensive simulation platform for modeling various physical phenomena using sensors.

## Setup Instructions

### Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed on your machine. You can download and install them from [Node.js](https://nodejs.org/).

### Installing Node.js and npm

1. **Download Node.js and npm**: Visit the [Node.js download page](https://nodejs.org/) and download the installer for your operating system.
2. **Run the Installer**: Follow the installation instructions provided in the installer. This will install both Node.js and npm.
3. **Verify Installation**: Open your terminal or command prompt and run the following commands to verify the installation:
   ```bash
   node -v
   npm -v
   ```

### Cloning the Repository

1. **Clone the Repository**: Clone the project repository from GitHub.
   ```bash
   git clone https://github.com/derrick-zero/quantum-sensor-sim
   cd quantum-sensor-sim
   ```

### Installing Dependencies

1. **Install npm Packages**: Install the necessary npm packages for the project.
   ```bash
   npm install
   ```

### Building the Project

1. **Build the Project**: Run the TypeScript compiler to build the project.
   ```bash
   npm run build
   ```

### Running Tests

1. **Run Tests**: Execute the tests using Jest to ensure everything is working correctly.
   ```bash
   npm test
   ```

### Recommended Extensions

To enhance your development experience in VS Code, install the following extensions:

- **ESLint** (`dbaeumer.vscode-eslint`): Provides integration with ESLint to identify and fix linting issues.
- **Prettier - Code Formatter** (`esbenp.prettier-vscode`): Formats your code consistently.
- **Jest** (`orta.vscode-jest`): Provides integration with Jest for running tests and viewing test results.
- **TypeScript and JavaScript Language Features** (`ms-vscode.vscode-typescript-tslint-plugin`): Includes syntax highlighting, IntelliSense, and more for TypeScript and JavaScript.
- **Edge DevTools for VS Code** (`ms-edgedevtools.vscode-edge-devtools`): Allows you to debug your JavaScript code in the Edge browser.

### Configuring Extensions

#### **ESLint Configuration**

1. Install the ESLint extension (`dbaeumer.vscode-eslint`).
2. Ensure you have an ESLint configuration file (`.eslintrc.json`) in your project root.
3. Add the following settings to your VS Code workspace settings (`QuantumSensorSim.code-workspace`):

   ```json
   "eslint.enable": true,
   "eslint.options": {
     "configFile": ".eslintrc.json"
   },
   ```

4. To automatically fix linting issues on save, add the following to your workspace settings:

   ```json
   "editor.codeActionsOnSave": {
     "source.fixAll.eslint": true
   }
   ```

#### **Prettier Configuration**

1. Install the Prettier extension (`esbenp.prettier-vscode`).
2. Ensure you have a Prettier configuration file (`.prettierrc`) in your project root.
3. Add the following settings to your VS Code workspace settings (`QuantumSensorSim.code-workspace`):

   ```json
   "editor.formatOnSave": true,
   "prettier.requireConfig": true
   ```

#### **Jest Configuration**

1. Install the Jest extension (`orta.vscode-jest`).
2. Ensure you have a Jest configuration file (`jest.config.js`) in your project root.
3. Add the following settings to your VS Code workspace settings (`QuantumSensorSim.code-workspace`):

   ```json
   "jest.enableCodeLens": true,
   "jest.autoRun": "off",
   "jest.runAllTestsFirst": true,
   "jest.showCoverageOnLoad": true
   ```

### CLI for Installing and Configuring npm Packages and VS Code Extensions

#### **Installing npm Packages**

Run the following command to install the necessary npm packages:

```bash
npm install typescript jest ts-jest @types/jest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier ts-node nodemon husky lint-staged @commitlint/config-conventional @commitlint/cli --save-dev
```

#### **Configuring Husky and lint-staged**

Add the following configurations to your `package.json` file:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write", "git add"]
  }
}
```

#### **Installing and Configuring VS Code Extensions**

To install the recommended VS Code extensions, run the following commands:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension orta.vscode-jest
code --install-extension ms-vscode.vscode-typescript-tslint-plugin
code --install-extension ms-edgedevtools.vscode-edge-devtools
```

## Git Commands

### Cloning the Repository

To clone the repository, use the following command:

```bash
git clone https://github.com/derrick-zero/quantum-sensor-sim
cd quantum-sensor-sim
```

### Creating a New Branch

To create a new branch for your feature or bug fix, use the following command:

```bash
git checkout -b <branch-name>
```

### Staging and Committing Changes

To stage your changes, use the following command:

```bash
git add .
```

To commit your changes, use the following command:

```bash
git commit -m "Commit message"
```

### Pushing Changes

To push your changes to the remote repository, use the following command:

```bash
git push origin <branch-name>
```

### Creating a Pull Request

To create a pull request, go to the repository on GitHub, navigate to the "Pull requests" tab, and click "New pull request". Provide a clear description of your changes and any relevant information.

## Usage

- Detailed API documentation is available in `docs/API_REFERENCE.md`.

## Contributing

- See `docs/CONTRIBUTING.md` for guidelines on contributing to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
