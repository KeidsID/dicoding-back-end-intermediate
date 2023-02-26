const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../../common/utils/DbTables');
const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');
const NotFoundError = require(
    '../../../common/errors/subClasses/NotFoundError');

/**
 * CRUD Service for "songs" table from Database.
 */
class SongsService {
  #pool;

  /**
  */
  constructor() {
    this.#pool = new Pool();
  }

  /**
   * Create and add Song into database.
   *
   * @param {object} payload
   * @param {string} payload.title
   * @param {number} payload.year
   * @param {string} payload.genre
   * @param {string} payload.performer
   * @param {number | undefined} payload.duration
   * @param {string | undefined} payload.albumId
   *
   * @throws {InvariantError}
   * @return {Promise<string>} Song id
   */
  async addSong({
    title, year, genre, performer,
    duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.songs} VALUES(
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING id`,
      values: [
        id, title, year, performer,
        genre, duration, albumId,
      ],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add song');
    }

    return rows[0].id;
  }

  /**
   * Get Songs from database.
   *
   * @param {object} query
   * @param {string | undefined} query.title
   * @param {string | undefined} query.performer
   *
   * @return {Promise<object[]>} Array of Song object
   */
  async getSongs({title = '', performer = ''}) {
    const query = {
      text: `
          SELECT id, title, performer FROM ${DbTables.songs}
          WHERE title ILIKE $1 AND performer ILIKE $2
        `,
      values: [`%${title}%`, `%${performer}%`],
    };
    const {rows} = await this.#pool.query(query);

    return rows;
  }

  /**
   * Get Array of Songs from Database based on Album id.
   *
   * @param {string} albumId
   *
   * @throws {NotFoundError}
   *
   * @typedef {object} Song
   * @property {string} id
   * @property {string} title
   * @property {string} performer
   *
   * @return {Promise<Song[]>}
   */
  async getSongsByAlbumId(albumId) {
    const query = {
      text: `
        SELECT id, title, performer FROM ${DbTables.songs} 
        WHERE album_id = $1
      `,
      values: [albumId],
    };
    const {rows} = await this.#pool.query(query);

    return rows;
  }

  /**
   * Get Song from database based on id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Song object
   */
  async getSongById(id) {
    const query = {
      text: `
        SELECT 
          id, title, year, performer,
          genre, duration, album_id AS albumId
        FROM ${DbTables.songs} WHERE id = $1
      `,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Song not found');
    }

    return rows[0];
  }

  /**
   * Update Song from database based on id with a new value.
   *
   * @param {string} id
   * @param {object} payload
   * @param {string} payload.title
   * @param {number} payload.year
   * @param {string} payload.genre
   * @param {string} payload.performer
   * @param {number | undefined} payload.duration
   * @param {string | undefined} payload.albumId
   *
   * @throws {NotFoundError}
   */
  async editSongById(id, {
    title, year, genre, performer,
    duration, albumId,
  }) {
    const query = {
      text: `
        UPDATE ${DbTables.songs} SET 
          title = $1, year = $2, genre = $3,
          performer = $4, duration = $5, album_id = $6
        WHERE id = $7 RETURNING id
      `,
      values: [
        title, year, genre, performer,
        duration, albumId, id,
      ],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to update song. Id not found');
    }
  }

  /**
   * Delete Song from database based on id.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   */
  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${DbTables.songs} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed to delete song. Id not found');
    }
  }

  /**
   * Check if Song exist in the Database.
   *
   * @param {string} id
   *
   * @throws {NotFoundError}
   */
  async verifySong(id) {
    const query = {
      text: `SELECT id FROM ${DbTables.songs} WHERE id = $1`,
      values: [id],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Song not found');
    }
  }
}

module.exports = SongsService;
