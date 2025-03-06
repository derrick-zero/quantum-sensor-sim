// jest.unit.config.js
module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/integration/**',
  ],
};
