const DbTables = require('../src/common/utils/DbTables');

const FK_COLLABORATIONS_PLAYLISTS_ID =
    'fk_collaborations.playlist_id_playlists.id';
const FK_COLLABORATIONS_USERS_ID ='fk_collaborations.user_id_users.id';

exports.up = (pgm) => {
  pgm.createTable(DbTables.collaborations, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    user_id: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(DbTables.collaborations, FK_COLLABORATIONS_PLAYLISTS_ID, `
    FOREIGN KEY(playlist_id) REFERENCES ${DbTables.playlists}(id) 
    ON DELETE CASCADE
  `.trim(),
  );

  pgm.addConstraint(DbTables.collaborations, FK_COLLABORATIONS_USERS_ID, `
    FOREIGN KEY(user_id) REFERENCES ${DbTables.users}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(DbTables.collaborations, FK_COLLABORATIONS_USERS_ID);
  pgm.dropConstraint(DbTables.collaborations, FK_COLLABORATIONS_PLAYLISTS_ID);
  pgm.dropTable(DbTables.collaborations);
};
