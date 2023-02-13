const ClientError = require('./ClientError');

/**
 * For bad request (400).
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
