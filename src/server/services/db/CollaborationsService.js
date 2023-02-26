/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../../common/utils/DbTables');
const AuthorizationError = require(
    '../../../common/errors/subClasses/AuthorizationError');
const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const NotFoundError = require(
    '../../../common/errors/subClasses/NotFoundError');

// VsCode-JsDoc purpose
const UsersService = require('./UsersService');

/**
 * CRUD Service for "collaborations" table from Database.
 *
 * This table is the relation table between "playlists" table
 * and "users" table.
 */
class CollaborationsService {
  #pool;
  #usersService;

  /**
   * @param {UsersService} usersService
   */
  constructor(usersService) {
    this.#pool = new Pool();
    this.#usersService = usersService;
  }

  /**
   * Add collaborator to playlist.
   *
   * @param {object} payload
   * @param {string} payload.playlistId
   * @param {string} payload.userId
   *
   * @throws {ClientError}
   * @return {Promise<string>} Collab id
   */
  async addCollab({playlistId, userId}) {
    await this.#usersService.getUserById(userId); // Check if user exist

    const id = `collab-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.collaborations} VALUES(
        $1, $2, $3
      ) RETURNING id`,
      values: [id, playlistId, userId],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add collaborator');
    }

    return rows[0].id;
  }

  /**
   * Delete collaborator from playlist.
   *
   * @param {object} payload
   * @param {string} payload.playlistId
   * @param {string} payload.userId
   *
   * @throws {NotFoundError}
   */
  async deleteCollab({playlistId, userId}) {
    const query = {
      text: `
        DELETE FROM ${DbTables.collaborations} 
        WHERE playlist_id = $1 AND user_id = $2 RETURNING id
      `,
      values: [playlistId, userId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
          'Failed to delete Collaborator. Collaborator Not Found');
    }
  }

  /**
   * Verify collaborator access.
   *
   * @param {string} playlistId
   * @param {string} userId
   *
   * @throws {AuthorizationError}
   */
  async verifyCollab(playlistId, userId) {
    const query = {
      text: `
        SELECT id FROM ${DbTables.collaborations} 
        WHERE playlist_id = $1 AND user_id = $2
      `,
      values: [playlistId, userId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('You have no access');
    }
  }
}

module.exports = CollaborationsService;
