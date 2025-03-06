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
interface LoggerConfig {
  level: LogLevel;
  logToFile: boolean;
  logFilePath: string;
}

/**
 * Logger utility for logging messages with different levels and formatting.
 */
export class Logger {
  private static config: LoggerConfig = {
    level: LogLevel.INFO,
    logToFile: false,
    logFilePath: 'simulation.log',
  };

  /**
   * Configures the logger settings.
   * @param config - Partial configuration to update.
   */
  public static configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Logs a debug message.
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
   * Internal method to log messages based on the logging level.
   * @param level - The logging level.
   * @param message - The message to log.
   * @param context - Optional context information.
   */
  private static log(level: LogLevel, message: string, context?: string): void {
    if (level < this.config.level) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const contextStr = context ? `[${context}]` : '';
    const formattedMessage = `${timestamp} [${levelStr}] ${contextStr} ${message}`;

    // Log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // Log to file if enabled
    if (this.config.logToFile) {
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Writes log messages to a file.
   * @param message - The message to write.
   */
  private static writeToFile(message: string): void {
    fs.appendFile(this.config.logFilePath, message + '\n', err => {
      if (err) {
        console.error(
          `Logger Error: Failed to write to log file: ${err.message}`
        );
      }
    });
  }
}
