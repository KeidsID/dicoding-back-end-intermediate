const ClientError = require('./ClientError');

/**
 * For Not Found response (404).
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
