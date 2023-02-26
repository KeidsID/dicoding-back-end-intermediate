/* eslint-disable no-unused-vars */
const PATH_SONGS = '/songs';

// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const SongsHandler = require('./handler');

/**
 * Function to return routes for `/songs` endpoint.
 *
 * @param {SongsHandler} handler
 * @return {Hapi.ServerRoute[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_SONGS,
    handler: (req, h) => handler.postSong(req, h),
  },
  {
    method: 'GET', path: PATH_SONGS,
    handler: (req) => handler.getSongs(req),
  },
  {
    method: 'GET', path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.getSongById(req),
  },
  {
    method: 'PUT', path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.putSongById(req),
  },
  {
    method: 'DELETE', path: `${PATH_SONGS}/{id}`,
    handler: (req) => handler.deleteSongById(req),
  },
];


module.exports = routes;
