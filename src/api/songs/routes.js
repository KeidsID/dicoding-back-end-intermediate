const PATH_SONGS = '/songs';

// For VsCode-JSDoc purpose
// eslint-disable-next-line no-unused-vars
const SongsHandler = require('./handler');

/**
 *
 * @param {SongsHandler} handler
 * @return {Array<object>} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: PATH_SONGS,
    handler: (req, h) => handler.postSong(req, h),
  },
  {
    method: 'GET',
    path: PATH_SONGS,
    handler: () => handler.getSongs(),
  },
  {
    method: 'GET',
    path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.getSongById(req),
  },
  {
    method: 'PUT',
    path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.putSongById(req),
  },
  {
    method: 'DELETE',
    path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.deleteSongById(req),
  },
];


module.exports = routes;
