/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../common/utils/DbTables');
const AuthorizationError = require(
    '../../common/errors/subClasses/AuthorizationError');
const InvariantError = require('../../common/errors/subClasses/InvariantError');
const NotFoundError = require('../../common/errors/subClasses/NotFoundError');

// VsCode-JsDoc purpose
const CollaborationsService = require('./CollaborationsService');

/**
 * CRUD Service for "playlists" table from Database.
 */
class PlaylistsService {
  #pool;
  #collabsService;

  /**
   * @param {CollaborationsService} collaborationsService
   */
  constructor(collaborationsService) {
    this.#pool = new Pool();
    this.#collabsService = collaborationsService;
  }

  /**
   * Create and Add a playlist to Database.
   *
   * @param {string} owner
   * @param {object} payload
   * @param {string} payload.name
   *
   * @throws {InvariantError}
   * @return {Promise<string>} Playlist id
   */
  async addPlaylist(owner, {name}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.playlists} VALUES(
        $1, $2, $3
      ) RETURNING id`,
      values: [id, name, owner],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add playlist');
    }

    await this.#collabsService.addCollab({
      playlistId: id, userId: owner,
    });

    return rows[0].id;
  }

  /**
   * Get list of playlists based on owner from Database.
   *
   * @param {string} owner
   *
   * @return {Promise<object[]>} Array of Playlist
   */
  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT 
          ${DbTables.playlists}.id, ${DbTables.playlists}.name, 
          ${DbTables.users}.username
        FROM ${DbTables.playlists} 
        LEFT JOIN ${DbTables.users} ON 
          ${DbTables.playlists}.owner = ${DbTables.users}.id
        LEFT JOIN ${DbTables.collaborations} ON 
          ${DbTables.collaborations}.playlist_id = ${DbTables.playlists}.id
        WHERE 
          ${DbTables.playlists}.owner = $1 OR 
          ${DbTables.collaborations}.user_id = $1
        GROUP BY ${DbTables.playlists}.id, ${DbTables.users}.username
      `,
      values: [owner],
    };
    const {rows} = await this.#pool.query(query);

    return rows;
  }

  /**
   * Get playlist by id from Database.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Playlists object
   */
  async getPlaylistById(id) {
    const query = {
      text: `
        SELECT 
          ${DbTables.playlists}.id, ${DbTables.playlists}.name, 
          ${DbTables.users}.username
        FROM ${DbTables.playlists} 
        LEFT JOIN ${DbTables.users} ON 
          ${DbTables.playlists}.owner = ${DbTables.users}.id
        WHERE ${DbTables.playlists}.id = $1
      `,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist Not Found');
    }

    return rows[0];
  }

  /**
   * Delete playlist from Database.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   */
  async deletePlaylist(id) {
    const query = {
      text: `DELETE FROM ${DbTables.playlists} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
          'Failed to delete playlist. Playlist id not found',
      );
    }
  }

  /**
   * Verify playlist owner from Database.
   *
   * @param {string} id - Playlist id
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async verifyPlaylistOwner(id, userId) {
    const query = {
      text: `SELECT owner FROM ${DbTables.playlists} WHERE id = $1`,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist Not Found');
    }

    if (rows[0].owner !== userId) {
      throw new AuthorizationError('Only owners are allowed');
    }
  }

  /**
   * Verify collab access from Database.
   *
   * @param {string} id - Playlist id
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (e) {
      if (!(e instanceof AuthorizationError)) {
        throw e;
      }
    }

    await this.#collabsService.verifyCollab(id, userId);
  }
}

module.exports = PlaylistsService;
