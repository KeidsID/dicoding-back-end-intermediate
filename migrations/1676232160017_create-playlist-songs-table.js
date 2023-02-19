const DbTables = require('../src/common/utils/DbTables');

const FK_PLAYLIST_SONGS_PLAYLIST_ID =
    'fk_playlist_songs.playlist_id_playlists.id';
const FK_PLAYLIST_SONGS_SONG_ID = 'fk_playlist_songs.song_id_songs.id';

exports.up = (pgm) => {
  pgm.createTable(DbTables.playlistSongs, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    song_id: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(DbTables.playlistSongs, FK_PLAYLIST_SONGS_PLAYLIST_ID, `
    FOREIGN KEY(playlist_id) REFERENCES ${DbTables.playlists}(id) 
    ON DELETE CASCADE
  `.trim(),
  );

  pgm.addConstraint(DbTables.playlistSongs, FK_PLAYLIST_SONGS_SONG_ID, `
    FOREIGN KEY(song_id) REFERENCES ${DbTables.songs}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(DbTables.playlistSongs, FK_PLAYLIST_SONGS_SONG_ID);
  pgm.dropConstraint(DbTables.playlistSongs, FK_PLAYLIST_SONGS_PLAYLIST_ID);
  pgm.dropTable(DbTables.playlistSongs);
};
