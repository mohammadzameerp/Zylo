/**
 * Custom error class for operational errors.
 * Extends the native Error class with an HTTP status code.
 */
class ErrorResponse extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
