const {USERS_STR} = require('../src/common/constants');

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(USERS_STR, {
    id: {type: 'VARCHAR(50)', primaryKey: true},
    username: {type: 'VARCHAR(50)', unique: true, notNull: true},
    password: {type: 'TEXT', notNull: true},
    fullname: {type: 'TEXT', notNull: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(USERS_STR);
};
