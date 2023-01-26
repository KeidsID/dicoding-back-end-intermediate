const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');
const {songsDbToJson} = require('../../common/utils/dbToJson');

const SONGS_TABLE = 'songs';

/**
 * CRUD Service for Songs handling.
 */
class SongsService {
  /**
  * CRUD Service for Songs handling.
  */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Create and add Song object to database.
   *
   * @param {object} payload - Body request from Client.
   * @param {string} payload.title
   * @param {number} payload.year
   * @param {string} payload.genre
   * @param {string} payload.performer
   * @param {number|undefined} payload.duration
   * @param {string|undefined} payload.albumId
   *
   * @throws {InvariantError} Type of Error that may be thrown.
   * @return {Promise<string>} The unique Id of the new Song.
   */
  async addSong({
    title, year, genre,
    performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const filteredDuration = duration === undefined ? null : duration;
    const filteredAlbumId = albumId === undefined ? null : albumId;

    const query = {
      text: `
        INSERT INTO ${SONGS_TABLE} 
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id
      `,
      values: [
        id, title, year, performer,
        genre, filteredDuration, filteredAlbumId,
      ],
    };
    const qResult = await this._pool.query(query);

    if (!qResult.rows[0].id) {
      throw new InvariantError('Failed to add song');
    }

    return qResult.rows[0].id;
  }

  /**
   * Get Array of Song object from database based on the requested id.
   *
   * @return {Promise<object[]>} The Song object based on Id.
   */
  async getSongs() {
    const qResult = await this._pool.query(`
      SELECT id, title, performer 
      FROM ${SONGS_TABLE}
    `);

    return qResult.rows;
  }

  /**
   * Get Song object from database based on the requested id.
   *
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   * @return {Promise<object>} The Song object based on Id.
   */
  async getSongById(id) {
    const query = {
      text: `SELECT * FROM ${SONGS_TABLE} WHERE id = $1`,
      values: [id],
    };
    const qResult = await this._pool.query(query);

    if (!qResult.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return qResult.rows.map(songsDbToJson)[0];
  }

  /**
   * Update Song object from database based on the requested id with
   * a new value.
   *
   * @param {string} id - The id from endpoint.
   * @param {object} payload - Body request from Client.
   * @param {string} payload.title
   * @param {number} payload.year
   * @param {string} payload.genre
   * @param {string} payload.performer
   * @param {number|undefined} payload.duration
   * @param {string|undefined} payload.albumId
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  async editSongById(id, {
    title, year, genre,
    performer, duration, albumId,
  }) {
    const filteredDuration = duration === undefined ? null : duration;
    const filteredAlbumId = albumId === undefined ? null : albumId;

    const query = {
      text: `
        UPDATE ${SONGS_TABLE} 
        SET title = $1, year = $2, genre = $3,
          performer = $4, duration = $5, album_id = $6
        WHERE id = $7
        RETURNING id
      `,
      values: [
        title, year, genre,
        performer, filteredDuration,
        filteredAlbumId, id,
      ],
    };
    const qResult = await this._pool.query(query);

    if (!qResult.rows.length) {
      throw new NotFoundError('Failed to update song. Id not found');
    }
  }

  /**
   * Delete an Song object from database based on the requested id.
   *
   * @param {string} id - The id from endpoint.
   *
   * @throws {NotFoundError} Type of Error that may be thrown.
   */
  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${SONGS_TABLE} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const qResult = await this._pool.query(query);

    if (!qResult.rows.length) {
      throw new NotFoundError('Failed to delete song. Id not found');
    }
  }
}

module.exports = {SongsService, SONGS_TABLE};
