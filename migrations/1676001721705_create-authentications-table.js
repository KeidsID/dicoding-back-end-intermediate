const {AUTHENTICATIONS_STR} = require('../src/common/constants');

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(AUTHENTICATIONS_STR, {
    token: {type: 'TEXT', notNull: true},
  });
};

exports.down = (pgm) => {
  pgm.dropTable(AUTHENTICATIONS_STR);
};
