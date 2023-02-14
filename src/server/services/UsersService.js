const bcrypt = require('bcrypt');
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const {USERS_STR} = require('../../common/constants');
const AuthenticationError = require('../../common/errors/AuthenticationError');
const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');

/**
 * CRUD Service for "users" table from Database
 */
class UsersService {
  /**
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Create and Add User to Database.
   *
   * @param {object} payload
   * @param {string} payload.username
   * @param {string} payload.password
   * @param {string} payload.fullname
   *
   * @throws {InvariantError}
   * @return {Promise<string>} User id
   */
  async addUser({username, password, fullname}) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
        INSERT INTO ${USERS_STR} VALUES(
          $1, $2, $3, $4
        ) RETURNING id
      `,
      values: [id, username, hashedPassword, fullname],
    };
    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Fail to Add User');
    }

    return rows[0].id;
  }

  /**
   * Get user from Database by id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError} If users not found
   * @return {Promise<object>} User object
   */
  async getUserById(id) {
    const query = {
      text: `SELECT id, username, fullname FROM ${USERS_STR} WHERE id = $1`,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('User Not Found');
    }

    return rows[0];
  }

  /**
   * Verify username from Database.
   *
   * @param {string} username
   *
   * @throws {InvariantError} If username already in use.
   */
  async verifyUsername(username) {
    const query = {
      text: `SELECT * FROM ${USERS_STR} WHERE username = $1`,
      values: [username],
    };
    const {rowCount} = await this._pool.query(query);

    if (rowCount) {
      throw new InvariantError('Username already in use');
    }
  }

  /**
   * Verify user credential for auth.
   *
   * @param {object} payload
   * @param {string} payload.username
   * @param {string} payload.password
   *
   * @throws {AuthenticationError}
   * @return {Promise<string>} User id
   */
  async verifyCredential({username, password}) {
    const query = {
      text: `SELECT * FROM ${USERS_STR} WHERE username = $1`,
      values: [username],
    };
    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new AuthenticationError('Username not Found');
    }

    const {id, password: hashedPassword} = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new AuthenticationError('Wrong password');
    }

    return id;
  }
}

module.exports = UsersService;
