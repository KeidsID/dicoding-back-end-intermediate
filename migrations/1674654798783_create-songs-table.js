const {SONGS_STR} = require('../src/common/constants');

exports.up = (pgm) => {
  pgm.createTable(SONGS_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    title: {type: 'TEXT', notNull: true},
    year: {type: 'INTEGER', notNull: true},
    performer: {type: 'TEXT', notNull: true},
    genre: {type: 'TEXT', notNull: true},
    duration: {type: 'INTEGER', nullable: true},
    album_id: {type: 'VARCHAR(50)', nullable: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(SONGS_STR);
};
