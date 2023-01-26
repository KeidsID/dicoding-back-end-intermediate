/* eslint-disable camelcase */

const songsDbToJson = ({
  id, title, year, performer,
  genre, duration, album_id,
}) => ({
  id, title, year, performer,
  genre, duration, albumId: album_id,
});

module.exports = {songsDbToJson};
