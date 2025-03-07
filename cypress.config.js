module.exports = {
  e2e: {
    baseUrl: 'http://localhost:1234',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}', // Optionally narrow to .cy.
    supportFile: false,
    defaultCommandTimeout: 5000, // Optional: Increase if needed.
    env: {
      // Add any environment variables you might need for tests.
      exampleVar: 'exampleValue',
    },
  },
};
