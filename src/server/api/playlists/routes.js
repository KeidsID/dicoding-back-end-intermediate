/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose
const {playlistAuthStrategy} = require('../../../common/constants');
const PlaylistsHandler = require('./handler');

const PATH_PLAYLISTS = '/playlists';

/**
 * @param {PlaylistsHandler} handler
 * @return {object[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_PLAYLISTS,
    handler: (req, h) => handler.postPlaylist(req, h),
    options: {auth: playlistAuthStrategy},
  },
  {
    method: 'GET', path: PATH_PLAYLISTS,
    handler: (req) => handler.getPlaylists(req),
    options: {auth: playlistAuthStrategy},
  },
  {
    method: 'DELETE', path: `${PATH_PLAYLISTS}/{id}`,
    handler: (req) => handler.deletePlaylistById(req),
    options: {auth: playlistAuthStrategy},
  },
];


module.exports = routes;
