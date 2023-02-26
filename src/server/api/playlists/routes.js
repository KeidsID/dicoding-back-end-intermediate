/* eslint-disable no-unused-vars */
const PATH_PLAYLISTS = '/playlists';

// For VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const {userIdAuthStrategy} = require('../../../common/constants');
const PlaylistsHandler = require('./handler');

/**
 * Function to return routes for `/playlists` endpoint.
 *
 * @param {PlaylistsHandler} handler
 * @return {Hapi.ServerRoute[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_PLAYLISTS,
    handler: (req, h) => handler.postPlaylist(req, h),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'GET', path: PATH_PLAYLISTS,
    handler: (req) => handler.getPlaylists(req),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'DELETE', path: `${PATH_PLAYLISTS}/{id}`,
    handler: (req) => handler.deletePlaylistById(req),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'POST', path: `${PATH_PLAYLISTS}/{id}/songs`,
    handler: (req, h) => handler.postSongToPlaylist(req, h),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'GET', path: `${PATH_PLAYLISTS}/{id}/songs`,
    handler: (req) => handler.getSongsFromPlaylists(req),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'DELETE', path: `${PATH_PLAYLISTS}/{id}/songs`,
    handler: (req) => handler.deleteSongFromPlaylists(req),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'GET', path: `${PATH_PLAYLISTS}/{id}/activities`,
    handler: (req) => handler.getPlaylistSongActivities(req),
    options: {auth: userIdAuthStrategy},
  },
];


module.exports = routes;
