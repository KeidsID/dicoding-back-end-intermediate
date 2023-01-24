const ClientError = require('./ClientError');

/**
 * For 404 response.
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
