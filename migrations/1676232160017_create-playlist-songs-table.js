/* eslint-disable camelcase */
const {
  PLAYLIST_SONGS_STR, PLAYLISTS_STR, SONGS_STR,
} = require('../src/common/constants');

const FK_PLAYLIST_ID = 'fk_playlist_songs.playlist_id_playlists.id';
const FK_SONG_ID = 'fk_playlist_songs.song_id_songs.id';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(PLAYLIST_SONGS_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    song_id: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(PLAYLIST_SONGS_STR, FK_PLAYLIST_ID, `
    FOREIGN KEY(playlist_id) REFERENCES ${PLAYLISTS_STR}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
  pgm.addConstraint(PLAYLIST_SONGS_STR, FK_SONG_ID, `
    FOREIGN KEY(song_id) REFERENCES ${SONGS_STR}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(PLAYLIST_SONGS_STR, FK_SONG_ID);
  pgm.dropConstraint(PLAYLIST_SONGS_STR, FK_PLAYLIST_ID);
  pgm.dropTable(PLAYLIST_SONGS_STR);
};
