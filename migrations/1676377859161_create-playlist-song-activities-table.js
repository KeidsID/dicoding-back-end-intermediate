/* eslint-disable camelcase */
const {
  PLAYLIST_SONG_ACTIVITIES_STR, PLAYLISTS_STR,
} = require('../src/common/constants');

const ACTIONS_ENUM = 'ActionsEnum';
const FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID =
  'fk_playlist_song_activities.playlist_id_playlists.id';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TYPE ${ACTIONS_ENUM} AS ENUM ('add', 'delete')`);

  pgm.createTable(PLAYLIST_SONG_ACTIVITIES_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    user_id: {type: 'VARCHAR(50)', notNull: true},
    song_id: {type: 'VARCHAR(50)', notNull: true},
    action: {type: `${ACTIONS_ENUM}`, notNull: true},
    time: {type: 'TIMESTAMPTZ', notNull: true},
  });

  pgm.sql(`
    ALTER TABLE ${PLAYLIST_SONG_ACTIVITIES_STR}
    ALTER time SET DEFAULT CURRENT_TIMESTAMP
  `.trim(),
  );

  pgm.addConstraint(
      PLAYLIST_SONG_ACTIVITIES_STR,
      FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID,
      `
      FOREIGN KEY(playlist_id) REFERENCES ${PLAYLISTS_STR}(id) 
      ON DELETE CASCADE
      `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
      PLAYLIST_SONG_ACTIVITIES_STR,
      FK_PLAYLIST_SONG_ACTIVITIES_PLAYLIST_ID,
  );
  pgm.dropTable(PLAYLIST_SONG_ACTIVITIES_STR);
  pgm.sql(`DROP TYPE ${ACTIONS_ENUM}`);
};
