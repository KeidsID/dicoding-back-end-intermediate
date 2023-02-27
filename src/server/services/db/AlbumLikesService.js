const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../../common/utils/DbTables');
const InvariantError = require(
    '../../../common/errors/subClasses/InvariantError');

/**
 * CRUD Service for "album_likes" table from Database.
 *
 * Relation table between "albums" and "users" tables for
 * liking and unliking album.
 */
class AlbumLikesService {
  #pool;

  /**
   */
  constructor() {
    this.#pool = new Pool();
  }

  /**
   * Add like status on album.
   *
   * Make sure to verify the like status before liking.
   *
   * @param {string} albumId
   * @param {string} userId
   *
   * @throws {InvariantError}
   */
  async likeAnAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO ${DbTables.albumLikes} VALUES(
          $1, $2, $3
        ) RETURNING id
      `,
      values: [id, albumId, userId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Fail to like an album');
    }
  }

  /**
   * Remove like status on album.
   *
   * Make sure to verify the like status before disliking.
   *
   * @param {string} albumId
   * @param {string} userId
   *
   * @throws {InvariantError}
   */
  async dislikeAnAlbum(albumId, userId) {
    const query = {
      text: `
        DELETE FROM ${DbTables.albumLikes} 
        WHERE album_id = $1 AND user_id = $2
        RETURNING id
      `,
      values: [albumId, userId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Fail to dislike an album');
    }
  }

  /**
   * Check like status on album.
   *
   * Return true if liked, false otherwise.
   *
   * @param {string} albumId
   * @param {string} userId
   *
   * @return {Promise<boolean>}
   */
  async isAlbumLiked(albumId, userId) {
    const query = {
      text: `
        SELECT id FROM ${DbTables.albumLikes} 
        WHERE album_id = $1 AND user_id = $2
      `,
      values: [albumId, userId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      return false;
    }

    return true;
  }

  /**
   * Get likes count on Album.
   *
   * @param {string} albumId
   *
   * @return {Promise<number>} Likes count
   */
  async albumLikesCount(albumId) {
    const query = {
      text: `
        SELECT id FROM ${DbTables.albumLikes} 
        WHERE album_id = $1
      `,
      values: [albumId],
    };
    const {rowCount} = await this.#pool.query(query);

    return rowCount;
  }
}

module.exports = AlbumLikesService;
