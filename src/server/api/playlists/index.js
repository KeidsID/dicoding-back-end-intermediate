/* eslint-disable no-unused-vars */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const PlaylistsService = require('../../services/PlaylistsService');
const PlaylistSongsService = require('../../services/PlaylistSongsService');
const validator = require('../../validators/playlists');

module.exports = {
  name: 'playlists',
  version: '1.1.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {PlaylistsService} options.playlistsService
   * @param {PlaylistSongsService} options.playlistSongsService
   * @param {validator} options.validator
   */
  register: async (server, {
    playlistsService, playlistSongsService,
    validator,
  }) => {
    const handler = new PlaylistsHandler({
      playlistsService, playlistSongsService,
      validator,
    });

    server.route(routes(handler));
  },
};
