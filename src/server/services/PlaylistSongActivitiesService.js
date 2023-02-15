const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const {
  PLAYLIST_SONG_ACTIVITIES_STR, USERS_STR, SONGS_STR,
} = require('../../common/constants');
const InvariantError = require('../../common/errors/InvariantError');

/**
 * CRUD Service for "playlist_song_activities" table from Database.
 *
 * This table reference the "playlists" table.
 */
class PlaylistSongActivitiesService {
  /**
   */
  constructor() {
    this._pool = new Pool();
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
      text: `INSERT INTO ${PLAYLIST_SONG_ACTIVITIES_STR} VALUES(
        $1, $2, $3, $4, 'add'
      ) RETURNING id`,
      values: [id, playlistId, userId, songId],
    };
    const {rowCount} = await this._pool.query(query);

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
    const id = `psActivity-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${PLAYLIST_SONG_ACTIVITIES_STR} VALUES(
        $1, $2, $3, $4, 'delete'
      ) RETURNING id`,
      values: [id, playlistId, userId, songId],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Failed to record the activity');
    }
  }

  /**
   * Get list of activities on playlist.
   *
   * @param {string} id - Playlist id
   *
   * @return {Promise<object[]>} - Array of Activities
   */
  async getPlaylistActivities(id) {
    const query = {
      text: `
        SELECT 
          ${USERS_STR}.username, ${SONGS_STR}.title,
          ${PLAYLIST_SONG_ACTIVITIES_STR}.action, 
          ${PLAYLIST_SONG_ACTIVITIES_STR}.time
        FROM ${PLAYLIST_SONG_ACTIVITIES_STR}
        LEFT JOIN ${USERS_STR} ON
          ${USERS_STR}.id = ${PLAYLIST_SONG_ACTIVITIES_STR}.user_id
        LEFT JOIN ${SONGS_STR} ON
          ${SONGS_STR}.id = ${PLAYLIST_SONG_ACTIVITIES_STR}.song_id
        WHERE ${PLAYLIST_SONG_ACTIVITIES_STR}.playlist_id = $1
        GROUP BY 
          ${PLAYLIST_SONG_ACTIVITIES_STR}.id,
          ${USERS_STR}.username,
          ${SONGS_STR}.title
        ORDER BY time
      `,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

    return rows;
  }
}

module.exports = PlaylistSongActivitiesService;
