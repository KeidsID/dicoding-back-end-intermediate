const DbTables = require('../src/common/utils/DbTables');

const FK_PLAYLIST_OWNER = 'fk_playlists.owner_users.id';

exports.up = (pgm) => {
  pgm.createTable(DbTables.playlists, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    name: {type: 'TEXT', notNull: true},
    owner: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(
      DbTables.playlists, FK_PLAYLIST_OWNER,
      `FOREIGN KEY(owner) REFERENCES ${DbTables.users}(id) ON DELETE CASCADE`,
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(DbTables.playlists, FK_PLAYLIST_OWNER);
  pgm.dropTable(DbTables.playlists);
};
