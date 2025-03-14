module.exports = {
  e2e: {
    baseUrl: 'http://localhost:1234',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}', // Adjust pattern as needed for spec files.
    supportFile: false, // We're not using a support file; if needed, specify the path here.
    defaultCommandTimeout: 5000, // Default timeout for commands; increase if tests are sometimes flaky.
    // Optional: Disable video recording if not required.
    video: false,

    env: {
      // Environment variables for tests can be specified here.
      exampleVar: 'exampleValue',
    },
  },
};
