const DbTables = require('../src/common/utils/DbTables');

exports.up = (pgm) => {
  pgm.createTable(DbTables.authentications, {
    token: {type: 'TEXT', notNull: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(DbTables.authentications);
};
