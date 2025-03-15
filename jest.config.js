module.exports = {
  preset: 'ts-jest', // Uses ts-jest for TypeScript transformation.
  testEnvironment: 'node', // Tests run in a Node.js environment.
  roots: ['<rootDir>/tests'], // Tests are located in the "tests" directory.
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Matches test/spec files.
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Resolves these file types.
  collectCoverage: true, // Coverage is collected.
  collectCoverageFrom: [
    'src/**/*.{ts,js}', // Collect coverage from all TypeScript and JavaScript files in src.
    '!src/**/*.d.ts', // Exclude type declaration files.
    '!src/**/index.ts', // Exclude index files.
    '!src/**/types/**', // Exclude any internal type files.
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports.
  coverageReporters: ['html', 'text', 'lcov'], // Reporters for code coverage output.
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file run after the environment is set up.
  testSequencer: './testSequencer.js',
  verbose: true,
};
