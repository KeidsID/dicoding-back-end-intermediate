const ClientError = require('./ClientError');

/**
 * For bad Auth (401).
 */
class AuthenticationError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
