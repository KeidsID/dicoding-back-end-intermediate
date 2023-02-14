/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const {
  PLAYLISTS_STR, USERS_STR, COLLABORATIONS_STR,
} = require('../../common/constants');
const AuthorizationError = require('../../common/errors/AuthorizationError');
const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');

// VsCode-JsDoc purpose
const CollaborationsService = require('./CollaborationsService');

/**
 * CRUD Service for "playlists" table from Database.
 */
class PlaylistsService {
  /**
   * @param {CollaborationsService} collaborationsService
   */
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
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
      text: `INSERT INTO ${PLAYLISTS_STR} VALUES(
        $1, $2, $3
      ) RETURNING id`,
      values: [id, name, owner],
    };
    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add playlist');
    }

    await this._collaborationsService.addCollab({
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
          ${PLAYLISTS_STR}.id, ${PLAYLISTS_STR}.name, 
          ${USERS_STR}.username
        FROM ${PLAYLISTS_STR} 
        LEFT JOIN ${USERS_STR} ON ${PLAYLISTS_STR}.owner = ${USERS_STR}.id
        LEFT JOIN ${COLLABORATIONS_STR} ON 
          ${COLLABORATIONS_STR}.playlist_id = ${PLAYLISTS_STR}.id
        WHERE ${PLAYLISTS_STR}.owner = $1 OR ${COLLABORATIONS_STR}.user_id = $1
        GROUP BY ${PLAYLISTS_STR}.id, ${USERS_STR}.username
      `,
      values: [owner],
    };
    const {rows} = await this._pool.query(query);

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
          ${PLAYLISTS_STR}.id, ${PLAYLISTS_STR}.name, 
          ${USERS_STR}.username
        FROM ${PLAYLISTS_STR} LEFT JOIN ${USERS_STR} ON 
          ${PLAYLISTS_STR}.owner = ${USERS_STR}.id
        WHERE ${PLAYLISTS_STR}.id = $1
      `,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

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
      text: `DELETE FROM ${PLAYLISTS_STR} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this._pool.query(query);

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
      text: `SELECT owner FROM ${PLAYLISTS_STR} WHERE id = $1`,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

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
      if (!e instanceof AuthorizationError) {
        throw e;
      }
    }

    await this._collaborationsService.verifyCollab(id, userId);
  }
}

module.exports = PlaylistsService;
