/* eslint-disable camelcase */

const DbTables = require('../src/common/utils/DbTables');

const FK_ALBUM_LIKES_ALBUMS_ID =
    `fk_${DbTables.albumLikes}.album_id_${DbTables.albums}.id`;
const FK_ALBUM_LIKES_USERS_ID =
    `fk_${DbTables.albumLikes}.user_id_${DbTables.users}.id`;

exports.up = (pgm) => {
  pgm.createTable(DbTables.albumLikes, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    album_id: {type: 'VARCHAR(50)', notNull: true},
    user_id: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint(DbTables.albumLikes, FK_ALBUM_LIKES_ALBUMS_ID, `
    FOREIGN KEY(album_id) REFERENCES ${DbTables.albums}(id) 
    ON DELETE CASCADE
  `.trim(),
  );

  pgm.addConstraint(DbTables.albumLikes, FK_ALBUM_LIKES_USERS_ID, `
    FOREIGN KEY(user_id) REFERENCES ${DbTables.users}(id) 
    ON DELETE CASCADE
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(DbTables.albumLikes, FK_ALBUM_LIKES_USERS_ID);
  pgm.dropConstraint(DbTables.albumLikes, FK_ALBUM_LIKES_ALBUMS_ID);
  pgm.dropTable(DbTables.albumLikes);
};
