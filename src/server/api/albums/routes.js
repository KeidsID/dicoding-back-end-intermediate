const PATH_ALBUMS = '/albums';

// For JSDoc purpose
// eslint-disable-next-line no-unused-vars
const AlbumsHandler = require('./handler');

/**
 *
 * @param {AlbumsHandler} handler
 * @return {Array<object>} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: PATH_ALBUMS,
    handler: (req, h) => handler.postAlbum(req, h),
  },
  {
    method: 'GET',
    path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.getAlbumById(req),
  },
  {
    method: 'PUT',
    path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.putAlbumById(req),
  },
  {
    method: 'DELETE',
    path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.deleteAlbumById(req),
  },
];


module.exports = routes;
