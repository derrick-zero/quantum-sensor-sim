// jest.integration.config.js
module.exports = {
  // Extend the base Jest configuration
  ...require('./jest.config'),
  testMatch: ['**/?(*.)+(integration|int).[jt]s?(x)'],
  collectCoverage: false, // Optionally disable coverage for integration tests
  // Other integration-specific configurations
};
