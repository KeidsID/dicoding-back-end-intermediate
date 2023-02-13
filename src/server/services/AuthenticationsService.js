const {Pool} = require('pg');

const {AUTHENTICATIONS_STR} = require('../../common/constants');
const InvariantError = require('../../common/errors/InvariantError');

/**
 * CRUD Service for "authentications" table from Database.
 */
class AuthenticationsService {
  /**
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Add token to Database.
   *
   * @param {string} token - Refresh Token
   */
  async addToken(token) {
    const query = {
      text: `INSERT INTO ${AUTHENTICATIONS_STR} VALUES ($1)`,
      values: [token],
    };
    await this._pool.query(query);
  }


  /**
   * Verify token with tokens from Database.
   *
   * @param {string} token - Refresh Token
   *
   * @throws {InvariantError} If token invalid
   */
  async verifyToken(token) {
    const query = {
      text: `SELECT * FROM ${AUTHENTICATIONS_STR} WHERE token = $1`,
      values: [token],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Invalid Token');
    }
  }

  /**
   * Delete token from Database.
   *
   * @param {string} token - Refresh Token
   */
  async deleteToken(token) {
    const query = {
      text: `DELETE FROM ${AUTHENTICATIONS_STR} WHERE token = $1`,
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
