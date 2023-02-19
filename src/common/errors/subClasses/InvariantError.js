const ClientError = require('../ClientError');

/**
 * Error handler for Bad Request response (400).
 */
class InvariantError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
