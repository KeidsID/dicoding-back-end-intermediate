/**
 * Abstract Class with list of static Table Name from Database.
 *
 * Example: `DbTables.tableName`
 *
 * @abstract
 */
class DbTables {
  /**
   */
  constructor() {
    if (new.target === DbTables) {
      throw new TypeError('Cannot construct abstract class directly');
    }
  }

  static albums = 'albums';
  static authentications = 'authentications';
  static collaborations = 'collaborations';
  static playlists = 'playlists';
  static playlistSongActivities = 'playlist_song_activities';
  static playlistSongs = 'playlist_songs';
  static songs = 'songs';
  static users = 'users';
}

module.exports = DbTables;
