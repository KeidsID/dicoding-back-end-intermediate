const {ALBUMS_TABLE} = require('../src/server/services/AlbumsService');

exports.up = (pgm) => {
  pgm.createTable(ALBUMS_TABLE, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(ALBUMS_TABLE);
};
