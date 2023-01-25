/**
 * Super class for CustomError class.
 */
class ClientError extends Error {
  /**
   * @param {string} message
   * @param {int} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
