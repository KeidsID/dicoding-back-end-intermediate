/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../../common/utils/DbTables');
const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const NotFoundError = require(
    '../../../common/errors/subClasses/NotFoundError');

// VsCode-JsDoc purpose
const SongsService = require('./SongsService');

/**
 * CRUD Service for "albums" table from Database.
 */
class AlbumsService {
  #pool;
  #songsService;

  /**
   * @param {SongsService} songsService
   */
  constructor(songsService) {
    this.#pool = new Pool();
    this.#songsService = songsService;
  }

  /**
   * Create and add Album into database.
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
      text: `INSERT INTO ${DbTables.albums} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, year],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Failed to add album');
    }

    return rows[0].id;
  }

  /**
   * Get Album from database based on id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Album object
   */
  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${DbTables.albums} WHERE id = $1`,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Album not found');
    }

    const songs = await this.#songsService.getSongsByAlbumId(id);

    const albumObj = rows[0];
    albumObj['songs'] = songs;

    return albumObj;
  }

  /**
   * Update Album from database based on id with a new value.
   *
   * @param {string} id
   *
   * @param {object} payload
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {NotFoundError}
   */
  async editAlbumById(id, {name, year}) {
    const query = {
      text: `
        UPDATE ${DbTables.albums} SET name = $1, year = $2
        WHERE id = $3 RETURNING id
      `,
      values: [name, year, id],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to update album. Id not found');
    }
  }

  /**
   * Delete an Album from database based on id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   */
  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${DbTables.albums} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }
}

module.exports = AlbumsService;
