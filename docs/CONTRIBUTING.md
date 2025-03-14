# Contributing to Quantum Sensor Sim

Thank you for taking the time to contribute to Quantum Sensor Sim! We welcome contributions of all kinds—be it bug fixes, new features, documentation improvements, or testing enhancements. To make the contribution process as smooth as possible for everyone, please follow these guidelines.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Feature Requests](#feature-requests)
  - [Pull Requests](#pull-requests)
- [Coding Standards and Workflow](#coding-standards-and-workflow)
  - [Branching and Workflow](#branching-and-workflow)
  - [Code Style and Linting](#code-style-and-linting)
  - [Testing](#testing)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Documentation](#documentation)
- [Communication](#communication)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report any unacceptable behavior to [derrick.geiszler@gmail.com](mailto:derrick.geiszler@gmail.com).

## How to Contribute

### Reporting Bugs

- **Search Before Reporting:**
  Please check the [issue tracker](https://github.com/derrick-zero/quantum-sensor-sim/issues) for similar issues before creating a new bug report.
- **Provide Details:**
  When reporting a bug, include:
  - A clear and descriptive title.
  - The steps to reproduce the issue.
  - The expected and actual behavior.
  - Any relevant logs, screenshots, or code snippets.

### Feature Requests

- **Discuss First:**
  Open an issue to discuss your feature idea before submitting a pull request. This helps avoid duplication and aligns the request with our project roadmap.
- **Detail Your Idea:**
  Describe your proposed feature, its benefits to the project, and any design ideas or examples that illustrate its usage.

### Pull Requests

- **Fork and Clone:**
  Fork the repository, clone your fork locally, and create a new branch for your feature or bugfix.
- **Follow Coding Standards:**
  Adhere to our coding style and document your code where necessary (see Code Style below).
- **Write Tests:**
  Ensure that your changes are covered by unit tests and, if applicable, end-to-end tests.
- **Documentation:**
  Update or add documentation (README, API docs, ROADMAP, etc.) to reflect your changes.
- **Submit a Pull Request:**
  Create a pull request with a clear title and description. Reference the relevant issue(s) in your PR description.

## Coding Standards and Workflow

### Branching and Workflow

- We follow a GitFlow-inspired development process:
  - **Feature Branches:** For new features or bug fixes, create a branch from the main branch (e.g., `feature/your-feature`).
  - **Pull Requests:** Submit your branch as a pull request against the main branch.
  - Ensure your pull request has a clear description of the changes and references any related issues.

### Code Style and Linting

- **ESLint:**
  We use ESLint with strict rules to maintain code quality. Run:
  ```bash
  npm run lint
  ```

Fix any lint errors before submitting your code.

- **Prettier:**
  Maintain consistent code formatting. Our Prettier configuration is defined in `.prettierrc`. Run:
  ```bash
  npm run format
  ```
- **Comments and Documentation:**
  Use JSDoc comments to document public methods and important classes. This helps maintain clarity and generate API documentation.

### Testing

- **Unit Tests:**
  We use Jest for our unit tests. Ensure that any new features are covered by appropriate tests:
  ```bash
  npm run test
  ```
- **End-to-End Tests:**
  We use Cypress for integration and end-to-end tests. Verify that your changes do not break the demo:
  ```bash
  npm run test:e2e
  ```
- **Coverage:**
  We aim for 100% coverage on core modules. Please add tests if your contribution introduces new branches or functionality.

## Setting Up Your Development Environment

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

4. **Run Tests:**
   ```bash
   npm run test
   npm run lint
   ```

## Documentation

- The project documentation is maintained in Markdown files within the `docs/` directory.
- API documentation is generated using TypeDoc.
- Please update the README, ROADMAP.mmd, and API docs in `docs/` with any new changes or features.

## Communication

- Join our [Slack/Discord channel](#) for real-time questions and collaboration.
- For direct inquiries or suggestions, please open an issue or contact [derrick.geiszler@gmail.com](mailto:derrick.geiszler@gmail.com).

## License

This project is licensed under the [MIT License](../LICENSE).
