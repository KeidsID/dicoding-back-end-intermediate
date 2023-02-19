const DbTables = require('../src/common/utils/DbTables');

const ACTIONS_ENUM = 'ActionsEnum';
const FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID =
    'fk_playlist_song_activities.playlist_id_playlists.id';

exports.up = (pgm) => {
  pgm.sql(`CREATE TYPE ${ACTIONS_ENUM} AS ENUM ('add', 'delete')`);

  pgm.createTable(DbTables.playlistSongActivities, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    user_id: {type: 'VARCHAR(50)', notNull: true},
    song_id: {type: 'VARCHAR(50)', notNull: true},
    action: {type: `${ACTIONS_ENUM}`, notNull: true},
    time: {type: 'TIMESTAMPTZ', notNull: true},
  });

  pgm.sql(`
    ALTER TABLE ${DbTables.playlistSongActivities}
    ALTER time SET DEFAULT CURRENT_TIMESTAMP
  `.trim(),
  );

  pgm.addConstraint(
      DbTables.playlistSongActivities,
      FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID,
      `
      FOREIGN KEY(playlist_id) REFERENCES ${DbTables.playlists}(id) 
      ON DELETE CASCADE
      `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
      DbTables.playlistSongActivities,
      FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID,
  );
  pgm.dropTable(DbTables.playlistSongActivities);
  pgm.sql(`DROP TYPE ${ACTIONS_ENUM}`);
};
