/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const validator = require('../../validators/playlists');

/**
 * Hapi Plugin for `/playlists` endpoint.
 */
module.exports = {
  name: 'playlists',
  version: '1.2.1',
  /**
   * @param {Hapi.Server} server
   *
   * @param {object} options - The options for this plugin.
   * @param {PlaylistsService} options.playlistsService
   * @param {PlaylistSongsService} options.playlistSongsService
   * @param {PlaylistSongActivitiesService} options.playlistSongActivitiesService
   * @param {validator} options.validator
   */
  register: async (server, options) => {
    const handler = new PlaylistsHandler(options);

    server.route(routes(handler));
  },
};
