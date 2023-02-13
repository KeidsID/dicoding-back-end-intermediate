const {PLAYLISTS_STR, USERS_STR} = require('../src/common/constants');

const FK_PLAYLIST_OWNER = 'fk_playlists.owner_users.id';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(PLAYLISTS_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    name: {type: 'TEXT', notNull: true},
    owner: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(
      PLAYLISTS_STR, FK_PLAYLIST_OWNER,
      `FOREIGN KEY(owner) REFERENCES ${USERS_STR}(id) ON DELETE CASCADE`,
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(PLAYLISTS_STR, FK_PLAYLIST_OWNER);
  pgm.dropTable(PLAYLISTS_STR);
};
