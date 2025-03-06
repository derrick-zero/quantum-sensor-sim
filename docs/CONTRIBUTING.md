# Contributing to Quantum Sensor Sim

## How to Contribute

We welcome contributions! Follow these steps to contribute:

1. **Fork the Repository**: Click on the "Fork" button at the top right corner of the repository page to create a copy of the repository under your GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine.

   ```bash
   git clone https://github.com/derrick-zero/quantum-sensor-sim
   cd quantum-sensor-sim
   ```

3. **Create a New Branch**: Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b <branch-name>
   ```

4. **Write Tests**: Write tests for your changes to ensure functionality and prevent regressions.

5. **Stage Your Changes**: Stage the changes you have made.

   ```bash
   git add .
   ```

6. **Commit Your Changes**: Commit your changes with a meaningful commit message.

   ```bash
   git commit -m "Commit message"
   ```

7. **Push Your Changes**: Push your changes to the remote repository.

   ```bash
   git push origin <branch-name>
   ```

8. **Submit a Pull Request**: Go to the repository on GitHub, navigate to the "Pull requests" tab, and click "New pull request". Provide a clear description of your changes and any relevant information.

## Code of Conduct

We are committed to fostering a welcoming and inclusive community. Please review and follow our [Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## Coding Standards

- Adhere to the project's coding standards and best practices.
- Use meaningful variable and function names.
- Comment your code where necessary for clarity.
- Follow consistent naming conventions:
  - **Files and Directories**: Use kebab-case (e.g., `sensor-simulator.ts`).
  - **Classes and Interfaces**: Use PascalCase (e.g., `SensorSimulator`, `ISensor`).
  - **Variables and Functions**: Use camelCase (e.g., `calculateForce`, `sensorState`).
  - **Constants**: Use UPPER_CASE with underscores (e.g., `GRAVITATIONAL_CONSTANT`).

## Testing

- Write tests for new features and bug fixes.
- Run tests using `npm test` to ensure all tests pass.
- Ensure test coverage for critical paths and edge cases.

## Documentation

- Update the documentation as needed to reflect your changes.
- Add meaningful comments to your code to enhance readability and maintainability.

## Code Reviews

- Submit your pull request for review.
- Provide constructive feedback on others' pull requests.
- Review criteria include adherence to coding standards, test coverage, and performance considerations.
