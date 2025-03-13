/// <reference types="jest" />

import { expect } from '@jest/globals';
import * as fs from 'fs';
import { Logger, LogLevel } from '../src/core/Logger';

// Mock the 'fs' module to override 'appendFile'
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    appendFile: jest.fn((path, data, callback) => {
      callback(null);
    }),
  };
});

describe('Logger Class Unit Tests', () => {
  beforeEach(() => {
    // Reset Logger configuration before each test.
    Logger.configure({
      level: LogLevel.INFO,
      logToFile: false,
    });
    // Clear any previous mock calls.
    (fs.appendFile as unknown as jest.Mock).mockClear();
  });

  test('Should write logs to file when logToFile is enabled', () => {
    Logger.configure({ logToFile: true });
    Logger.info('Info message');
    expect(fs.appendFile).toHaveBeenCalled();
  });

  test('Should log messages at INFO level and above', () => {
    // eslint-disable-next-line no-console
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    Logger.info('Info message');
    Logger.warn('Warning message');
    Logger.error('Error message');

    // eslint-disable-next-line no-console
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('INFO'));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('WARN'));
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR')
    );
  });

  test('Should not log DEBUG messages when level is INFO', () => {
    // eslint-disable-next-line no-console
    console.debug = jest.fn();
    Logger.debug('Debug message');
    // eslint-disable-next-line no-console
    expect(console.debug).not.toHaveBeenCalled();
  });

  test('Should log DEBUG messages when level is DEBUG', () => {
    Logger.configure({ level: LogLevel.DEBUG });
    // eslint-disable-next-line no-console
    console.debug = jest.fn();
    Logger.debug('Debug message');
    // eslint-disable-next-line no-console
    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG')
    );
  });

  test('Should include context information in logs', () => {
    // eslint-disable-next-line no-console
    console.info = jest.fn();
    Logger.info('Context message', 'TestContext');
    // eslint-disable-next-line no-console
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('[TestContext]')
    );
  });

  // Optional: You could add further tests to verify log message formatting if desired.
});
