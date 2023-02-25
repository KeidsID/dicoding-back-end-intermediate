const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../common/utils/DbTables');
const InvariantError = require('../../common/errors/subClasses/InvariantError');

/**
 * CRUD Service for "playlist_song_activities" table from Database.
 *
 * This table reference the "playlists" table.
 */
class PlaylistSongActivitiesService {
  #pool;

  /**
   */
  constructor() {
    this.#pool = new Pool();
  }

  /**
   * Record activity as Adding Song.
   *
   * @param {string} playlistId
   * @param {string} userId
   * @param {string} songId
   *
   * @throws {InvariantError}
   */
  async recordAddSong(playlistId, userId, songId) {
    const id = `psActivity-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.playlistSongActivities} VALUES(
        $1, $2, $3, $4, 'add'
      ) RETURNING id`,
      values: [id, playlistId, userId, songId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Failed to record the activity');
    }
  }

  /**
   * Record activity as Removing Song.
   *
   * @param {string} playlistId
   * @param {string} userId
   * @param {string} songId
   *
   * @throws {InvariantError}
   */
  async recordDeleteSong(playlistId, userId, songId) {
    const id = `playlistSongActivity-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.playlistSongActivities} VALUES(
        $1, $2, $3, $4, 'delete'
      ) RETURNING id`,
      values: [id, playlistId, userId, songId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Failed to record the activity');
    }
  }

  /**
   * Get list of activities on playlist.
   *
   * @param {string} id - Playlist id
   *
   * @return {Promise<object[]>} Array of Activities
   */
  async getPlaylistActivities(id) {
    const query = {
      text: `
        SELECT 
          ${DbTables.users}.username, ${DbTables.songs}.title,
          ${DbTables.playlistSongActivities}.action, 
          ${DbTables.playlistSongActivities}.time
        FROM ${DbTables.playlistSongActivities}
        LEFT JOIN ${DbTables.users} ON
          ${DbTables.users}.id = ${DbTables.playlistSongActivities}.user_id
        LEFT JOIN ${DbTables.songs} ON
          ${DbTables.songs}.id = ${DbTables.playlistSongActivities}.song_id
        WHERE ${DbTables.playlistSongActivities}.playlist_id = $1
        GROUP BY 
          ${DbTables.playlistSongActivities}.id,
          ${DbTables.users}.username,
          ${DbTables.songs}.title
        ORDER BY time
      `,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

    return rows;
  }
}

module.exports = PlaylistSongActivitiesService;
