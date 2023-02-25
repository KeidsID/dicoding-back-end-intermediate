/* eslint-disable no-unused-vars */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');

const DbTables = require('../../common/utils/DbTables');
const InvariantError = require('../../common/errors/subClasses/InvariantError');
const NotFoundError = require('../../common/errors/subClasses/NotFoundError');

// VsCode-JsDoc purpose
const SongsService = require('./SongsService');

/**
 * CRUD Service for "playlist_songs" table from Database.
 *
 * This table is the relation table between "playlists" table
 * and "songs" table.
 */
class PlaylistSongsService {
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
   * Add song to playlist.
   *
   * @param {string} id - Playlist id
   * @param {object} payload
   * @param {string} payload.songId
   *
   * @throws {ClientError}
   */
  async addSongToPlaylist(id, {songId}) {
    await this.#songsService.verifySong(songId);

    const relationId = `playlistSong-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${DbTables.playlistSongs} VALUES (
        $1, $2, $3
      ) RETURNING id`,
      values: [relationId, id, songId],
    };
    const {rowCount} = await this.#pool.query(query);

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
        SELECT 
          ${DbTables.songs}.id, ${DbTables.songs}.title, 
          ${DbTables.songs}.performer 
        FROM ${DbTables.playlistSongs} 
        RIGHT JOIN  ${DbTables.songs} ON 
          ${DbTables.playlistSongs}.song_id = ${DbTables.songs}.id
        WHERE ${DbTables.playlistSongs}.playlist_id = $1
        GROUP BY ${DbTables.songs}.id
      `,
      values: [id],
    };
    const {rows} = await this.#pool.query(query);

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
    await this.#songsService.verifySong(songId);

    const query = {
      text: `
        DELETE FROM ${DbTables.playlistSongs} 
        WHERE playlist_id = $1 AND song_id = $2 RETURNING id
      `,
      values: [id, songId],
    };
    const {rowCount} = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
          'Failed to delete song from playlist. Song not found');
    }
  }
}

module.exports = PlaylistSongsService;
