const ClientError = require('../ClientError');

/**
 * Error handler for Forbidden Access response (403).
 */
class AuthorizationError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
