const USERS_STR = 'users';
const AUTHENTICATIONS_STR = 'authentications';
const COLLABORATIONS_STR = 'collaborations';

const SONGS_STR = 'songs';
const ALBUMS_STR = 'albums';

const PLAYLISTS_STR = 'playlists';
const PLAYLIST_SONGS_STR = 'playlist_songs';
const PLAYLIST_SONG_ACTIVITIES_STR = 'playlist_song_activities';

const playlistAuthStrategy = 'playlist_auth_strategy';

const currentYear = new Date().getFullYear();

module.exports = {
  USERS_STR, AUTHENTICATIONS_STR, COLLABORATIONS_STR,
  SONGS_STR, ALBUMS_STR,
  PLAYLISTS_STR, PLAYLIST_SONGS_STR, PLAYLIST_SONG_ACTIVITIES_STR,
  playlistAuthStrategy, currentYear,
};
