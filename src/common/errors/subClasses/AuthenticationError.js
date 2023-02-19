const ClientError = require('../ClientError');

/**
 * Error handler for Bad Auth response (401).
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
