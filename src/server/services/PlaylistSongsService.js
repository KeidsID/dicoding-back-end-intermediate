/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const {PLAYLIST_SONGS_STR, SONGS_STR} = require('../../common/constants');
const InvariantError = require('../../common/errors/InvariantError');
const NotFoundError = require('../../common/errors/NotFoundError');

// VsCode-JsDoc purpose
const SongsService = require('./SongsService');

/**
 * CRUD Service for "playlist_songs" table from Database.
 *
 * This table is the relation table between "playlists" table
 * and "songs" table.
 */
class PlaylistSongsService {
  /**
   * @param {SongsService} songsService
   */
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  /**
   * Add song to playlist.
   *
   * @param {string} id - Playlist id
   * @param {object} payload
   * @param {string} payload.songId
   *
   * @throws {ClientError}
   */
  async addSongToPlaylist(id, {songId}) {
    await this._songsService.verifySong(songId);

    const relationId = `playlists.songs-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${PLAYLIST_SONGS_STR} VALUES (
        $1, $2, $3
      ) RETURNING id`,
      values: [relationId, id, songId],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Failed to add song into playlist');
    }
  }

  /**
   * Get songs from playlist.
   *
   * @param {string} id - Playlist id
   *
   * @return {Promise<object[]>} Array of Songs
   */
  async getSongsFromPlaylist(id) {
    const query = {
      text: `
        SELECT ${SONGS_STR}.id, ${SONGS_STR}.title, ${SONGS_STR}.performer 
          FROM ${PLAYLIST_SONGS_STR} 
        RIGHT JOIN  ${SONGS_STR} ON 
          ${PLAYLIST_SONGS_STR}.song_id = ${SONGS_STR}.id
        WHERE ${PLAYLIST_SONGS_STR}.playlist_id = $1
        GROUP BY ${SONGS_STR}.id
      `,
      values: [id],
    };
    const {rows} = await this._pool.query(query);

    return rows;
  }

  /**
   * Delete song from playlist.
   *
   * @param {string} id - Playlist id
   * @param {object} payload
   * @param {string} payload.songId
   *
   * @throws {NotFoundError}
   */
  async deleteSongFromPlaylist(id, {songId}) {
    await this._songsService.verifySong(songId);

    const relationId = `playlists.songs-${nanoid(16)}`;

    const query = {
      text: `
        DELETE FROM ${PLAYLIST_SONGS_STR} 
        WHERE playlist_id = $1 AND song_id = $2 RETURNING id
      `,
      values: [id, songId],
    };
    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
          'Failed to delete song from playlist. Song not found');
    }
  }
}

module.exports = PlaylistSongsService;
