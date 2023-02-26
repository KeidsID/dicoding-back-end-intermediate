/* eslint-disable camelcase */
const DbTables = require('../src/common/utils/DbTables');

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(DbTables.albums, {
    cover_url: {type: 'TEXT', unique: true, default: null},
  });
};

exports.down = (pgm) => {
  pgm.dropColumns(DbTables.albums, ['cover_url']);
};
