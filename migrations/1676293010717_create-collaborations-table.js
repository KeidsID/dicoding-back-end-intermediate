/* eslint-disable camelcase */
const {
  COLLABORATIONS_STR, PLAYLISTS_STR, USERS_STR,
} = require('../src/common/constants');

const FK_COLLABORATIONS_PLAYLISTS_ID =
  'fk_collaborations.playlist_id_playlists.id';
const FK_COLLABORATIONS_USERS_ID ='fk_collaborations.user_id_users.id';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(COLLABORATIONS_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    playlist_id: {type: 'VARCHAR(50)', notNull: true},
    user_id: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(COLLABORATIONS_STR, FK_COLLABORATIONS_PLAYLISTS_ID, `
    FOREIGN KEY(playlist_id) REFERENCES ${PLAYLISTS_STR}(id) 
    ON DELETE CASCADE
  `.trim(),
  );

  pgm.addConstraint(COLLABORATIONS_STR, FK_COLLABORATIONS_USERS_ID, `
    FOREIGN KEY(user_id) REFERENCES ${USERS_STR}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(COLLABORATIONS_STR, FK_COLLABORATIONS_USERS_ID);
  pgm.dropConstraint(COLLABORATIONS_STR, FK_COLLABORATIONS_PLAYLISTS_ID);
  pgm.dropTable(COLLABORATIONS_STR);
};
