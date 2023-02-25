const {Pool} = require('pg');

const DbTables = require('../../common/utils/DbTables');
const InvariantError = require('../../common/errors/subClasses/InvariantError');

/**
 * CRUD Service for "authentications" table from Database.
 */
class AuthenticationsService {
  #pool;

  /**
   */
  constructor() {
    this.#pool = new Pool();
  }

  /**
   * Add token into Database.
   *
   * @param {string} token - Refresh Token
   */
  async addToken(token) {
    const query = {
      text: `INSERT INTO ${DbTables.authentications} VALUES ($1)`,
      values: [token],
    };
    await this.#pool.query(query);
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
      text: `SELECT * FROM ${DbTables.authentications} WHERE token = $1`,
      values: [token],
    };
    const {rowCount} = await this.#pool.query(query);

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
      text: `DELETE FROM ${DbTables.authentications} WHERE token = $1`,
      values: [token],
    };
    await this.#pool.query(query);
  }
}

module.exports = AuthenticationsService;
