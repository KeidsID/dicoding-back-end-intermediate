/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');
const {ALBUMS_STR, SONGS_STR}= require('../../common/constants');

// VsCode-JsDoc purpose
const SongsService = require('./SongsService');

/**
 * CRUD Service for "albums" table from Database.
 */
class AlbumsService {
  /**
   * @param {SongsService} songsService
   */
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  /**
   * Create and add Album object to database.
   *
   * @param {object} payload
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {InvariantError}
   * @return {Promise<string>} Album id
   */
  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${ALBUMS_STR} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, year],
    };
    const {rows} = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Failed to add album');
    }

    return rows[0].id;
  }

  /**
   * Get Album object from database based on the requested id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Album object
   */
  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${ALBUMS_STR} WHERE id = $1`,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Album not found');
    }

    const songs = await this._songsService.getSongsByAlbumId(id);

    const albumDetail = rows[0];
    albumDetail['songs'] = songs;

    return albumDetail;
  }

  /**
   * Update Album object from database based on the requested id with
   * a new value.
   *
   * @param {string} id
   * @param {object} payload
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {NotFoundError}
   */
  async editAlbumById(id, {name, year}) {
    const query = {
      text: `
        UPDATE ${ALBUMS_STR} SET name = $1, year = $2
        WHERE id = $3 RETURNING id
      `,
      values: [name, year, id],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to update album. Id not found');
    }
  }

  /**
   * Delete an Album object from database based on the requested id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   */
  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${ALBUMS_STR} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }
}

module.exports = AlbumsService;
