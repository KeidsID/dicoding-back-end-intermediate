const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');
const myConst = require('../../common/constants');

/**
 * CRUD Service for Albums handling.
 */
class AlbumsService {
  /**
  * CRUD Service for Albums handling.
  */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Create and add Album object to database.
   *
   * @param {object} payload - Body request from Client.
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {InvariantError} Type of Error that may be thrown.
   * @return {Promise<string>} The unique Id of the new Album.
   */
  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${myConst.ALBUMS} VALUES($1, $2, $3) RETURNING id`,
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
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   * @return {Promise<object>} The Album object based on Id.
   */
  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${myConst.ALBUMS} WHERE id = $1`,
      values: [id],
    };
    const qResult = await this._pool.query(query);

    if (!qResult.rowCount) {
      throw new NotFoundError('Album not found');
    }

    const songsQuery = {
      text: `
        SELECT id, title, performer 
        FROM ${myConst.SONGS} WHERE album_id = $1
      `,
      values: [id],
    };
    const songsQResult = await this._pool.query(songsQuery);

    const albumDetail = qResult.rows[0];
    albumDetail['songs'] = songsQResult.rows;

    return albumDetail;
  }

  /**
   * Update Album object from database based on the requested id with
   * a new value.
   *
   * @param {string} id - The id from endpoint.
   * @param {object} payload - Body request from Client.
   * @param {string} payload.name
   * @param {number} payload.year
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  async editAlbumById(id, {name, year}) {
    const query = {
      text: `
        UPDATE ${myConst.ALBUMS} SET name = $1, year = $2
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
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${myConst.ALBUMS} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to delete album. Id not found');
    }
  }
}

module.exports = AlbumsService;
