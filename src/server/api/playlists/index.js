/* eslint-disable no-unused-vars */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const PlaylistsService = require('../../services/PlaylistsService');
const validator = require('../../validators/playlists');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {PlaylistsService} options.playlistsService
   * @param {validator} options.validator
   */
  register: async (server, {
    playlistsService, validator,
  }) => {
    const handler = new PlaylistsHandler({
      playlistsService, validator,
    });

    server.route(routes(handler));
  },
};
