import * as fs from 'fs';

/**
 * Enumeration for logging levels.
 */
export enum LogLevel {
  DEBUG = 1,
  INFO,
  WARN,
  ERROR,
}

/**
 * Logger configuration interface.
 */
export interface LoggerConfig {
  level: LogLevel;
  logToFile: boolean;
  logFilePath: string;
}

/**
 * Logger utility for logging messages with different levels and formatting.
 *
 * This Logger is designed to be simple and self-contained.
 * It supports both console logging (with timestamp and context)
 * and file logging, if enabled.
 */
export class Logger {
  private static config: LoggerConfig = {
    level: LogLevel.INFO,
    logToFile: false,
    logFilePath: 'simulation.log',
  };

  /**
   * Configures the logger settings.
   * @param config - A partial configuration to merge with the defaults.
   */
  public static configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Logs a debug message if the logging level is met.
   * @param message - The message to log.
   * @param context - Optional context information.
   */
  public static debug(message: string, context?: string): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Logs an info message.
   * @param message - The message to log.
   * @param context - Optional context information.
   */
  public static info(message: string, context?: string): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param context - Optional context information.
   */
  public static warn(message: string, context?: string): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param context - Optional context information.
   */
  public static error(message: string, context?: string): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Internal method to log messages, both to the console and optionally to a file.
   * @param level - The logging level.
   * @param message - The message to log.
   * @param context - Optional context to include.
   */
  private static log(level: LogLevel, message: string, context?: string): void {
    // Only log if this level is appropriate
    if (level < this.config.level) {
      return;
    }

    // Create timestamp and formatted message
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const contextStr = context ? `[${context}] ` : '';
    const formattedMessage = `${timestamp} [${levelStr}] ${contextStr}${message}`;

    // Log to console based on log level
    switch (level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // If file logging is enabled, append the message to the log file.
    if (this.config.logToFile) {
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Appends the log message to the configured log file.
   * @param message - The message to write.
   */
  private static writeToFile(message: string): void {
    fs.appendFile(this.config.logFilePath, message + '\n', err => {
      if (err) {
        console.error(
          `Logger Error: Unable to write to log file: ${err.message}`
        );
      }
    });
  }
}
