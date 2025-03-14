// jest.integration.config.js
module.exports = {
  // Extend the base Jest configuration
  ...require('./jest.config'),
  testMatch: ['**/?(*.)+(integration|int).[jt]s?(x)'],
  collectCoverage: false, // Disable coverage collection for integration tests to speed up builds
  // Optionally, if your integration tests target a browser environment with a DOM,
  // you might consider changing the test environment to "jsdom" instead of "node":
  // testEnvironment: 'jsdom'
  // Additional integration-specific configuration options can be added here.
};
