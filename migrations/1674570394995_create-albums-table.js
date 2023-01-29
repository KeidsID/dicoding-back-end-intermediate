const {ALBUMS} = require('../src/common/constants');

exports.up = (pgm) => {
  pgm.createTable(ALBUMS, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    name: {type: 'TEXT', notNull: true},
    year: {type: 'INTEGER', notNull: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(ALBUMS);
};
