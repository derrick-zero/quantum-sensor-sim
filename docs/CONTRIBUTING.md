# Contributing to Quantum Sensor Sim

Thank you for your interest in contributing to Quantum Sensor Sim! We welcome your help in fixing bugs, suggesting and implementing new features, improving documentation, and enhancing test coverage. By contributing, you help make the project stronger and more valuable for everyone.

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
  - [Documentation](#documentation)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Communication](#communication)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By contributing, you agree to abide by this code. Please report any unacceptable behavior to [derrick.geiszler@gmail.com](mailto:derrick.geiszler@gmail.com).

## How to Contribute

### Reporting Bugs

- **Search** the [issue tracker](https://github.com/derrick-zero/quantum-sensor-sim/issues) before creating a new bug report.
- **Provide Details:**
  Include a clear description of the problem, steps to reproduce the bug, expected versus actual behavior, and any relevant stack traces or screenshots.

### Feature Requests

- **Discuss First:**
  Please open an issue to discuss your proposed feature before submitting a pull request.
- **Detail Your Idea:**
  Include examples, describe how your suggestion improves the project, and explain any design considerations.

### Pull Requests

- **Fork and Clone:**
  Fork the repository, clone your fork locally, and create a feature branch (e.g., `feature/my-new-feature` or `bugfix/issue-description`).
- **Follow Coding Standards:**
  Write clean, modular code with clear JSDoc comments for public APIs. Ensure your changes adhere to our ESLint and Prettier rules.
- **Testing:**
  Write unit tests (using Jest) and, if applicable, add or update end-to-end tests (using Cypress) to cover your changes. Aim to maintain or improve our high test coverage.
- **Documentation:**
  Update or add documentation ([README](../README.md), [API_REFERENCE](./API_REFERENCE.md), [ROADMAP](../ROADMAP.mmd)) to reflect your changes.
- **Submit a Pull Request:**
  Open a pull request with a clear title and description explaining the purpose of your changes. Reference related issues or feature requests.

## Coding Standards and Workflow

### Branching and Workflow

- We follow a GitFlow-inspired branching model:
  - **Main Branch:** The stable production code.
  - **Feature Branches:** Create a new branch for each feature or bug fix from the main branch.
  - **Pull Requests:** All contributions must be submitted via pull requests. If you've set up [CODEOWNERS](../CODEOWNERS) and branch protection rules, your PR will require approval before merging.

### Code Style and Linting

- **ESLint and Prettier:**
  Our code is strictly linted according to the rules defined in `.eslintrc.json` and formatted using Prettier according to `.prettierrc`.

  - Run `npm run lint` to check for linting issues.
  - Run `npm run format` to automatically format your code.

- **Comments and Documentation:**
  Write clear JSDoc comments for all public-facing functions and classes. This documentation is used to generate our API references.

### Testing

- **Unit Tests:**
  We use Jest for unit testing. Run tests via `npm run test` or `npm test:unit`.

- **Integration and E2E Tests:**
  We use Jest (with a separate integration config) and Cypress for end-to-end testing.

  - Run integration tests via `npm run test:integration`.
  - Run E2E tests via `npm run test:e2e`.

- **Coverage:**
  Aim for high coverage (close to 100%). If you add new logic or features, ensure that corresponding tests are added.

### Documentation

- Update documentation when adding, modifying, or removing features.
- Our API documentation is generated using TypeDoc; please ensure that your code comments are clear and comprehensive.
- Ensure that README.md, CONTRIBUTING.md, and ROADMAP.mmd are updated as needed.

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
   - Run unit tests:
     ```bash
     npm run test
     ```
   - Run end-to-end tests:
     ```bash
     npm run test:e2e
     ```
   - Run lint and format:
     ```bash
     npm run lint
     npm run format
     ```

## Communication

- Join our [Slack/Discord channel](#) for live discussions and help.
- For questions or suggestions, please open an issue or reach out via [derrick.geiszler@gmail.com](mailto:derrick.geiszler@gmail.com).

## License

This project is licensed under the [MIT License](../LICENSE).
