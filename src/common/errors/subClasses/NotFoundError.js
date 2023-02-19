const ClientError = require('../ClientError');

/**
 * Error handler for Not Found response (404).
 */
class NotFoundError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
