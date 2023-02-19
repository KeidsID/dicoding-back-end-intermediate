const DbTables = require('../src/common/utils/DbTables');

exports.up = (pgm) => {
  pgm.createTable(DbTables.albums, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    name: {type: 'TEXT', notNull: true},
    year: {type: 'INTEGER', notNull: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(DbTables.albums);
};
