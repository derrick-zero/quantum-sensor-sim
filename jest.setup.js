// jest.setup.js

// Polyfill or mock global.fetch using node-fetch.
// This makes fetch available in tests as it might be in the browser.
global.fetch = require('node-fetch');

// Optionally, extend Jest's expect with custom matchers if needed.
// For example, you might add:
// const matchers = require('jest-extended');
// expect.extend(matchers);

// Configure any other global setups or mocks here.
// For example, if you need to set up a global configuration for a library:
// process.env.SOME_GLOBAL_VAR = 'some-value';

// If using a testing library that requires additional setup, include it here.
