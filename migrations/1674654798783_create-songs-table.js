const DbTables = require('../src/common/utils/DbTables');

exports.up = (pgm) => {
  pgm.createTable(DbTables.songs, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    title: {type: 'TEXT', notNull: true},
    year: {type: 'INTEGER', notNull: true},
    performer: {type: 'TEXT', notNull: true},
    genre: {type: 'TEXT', notNull: true},
    duration: {type: 'INTEGER'},
    album_id: {type: 'VARCHAR(50)'},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(DbTables.songs);
};
