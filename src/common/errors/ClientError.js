/**
 * Super class for Server Error Handling.
 *
 * This class includes response codes that are
 * used to respond to client requests.
 *
 * Check the subclasses for specific response codes.
 *
 * @abstract
 */
class ClientError extends Error {
  /**
   * @param {string} message
   * @param {int} statusCode
   */
  constructor(message, statusCode = 400) {
    if (new.target === ClientError) {
      throw new TypeError('Cannot construct abstract class directly');
    }

    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
