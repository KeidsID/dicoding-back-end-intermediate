/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const PlaylistsService = require('../../services/PlaylistsService');
const PlaylistSongsService = require('../../services/PlaylistSongsService');
const PlaylistSongActivitiesService = require(
    '../../services/PlaylistSongActivitiesService');
const validator = require('../../validators/playlists');

module.exports = {
  name: 'playlists',
  version: '1.2.1',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {PlaylistsService} options.playlistsService
   * @param {PlaylistSongsService} options.playlistSongsService
   * @param {PlaylistSongActivitiesService} options.playlistSongActivitiesService
   * @param {validator} options.validator
   */
  register: async (server, {
    playlistsService, playlistSongsService,
    playlistSongActivitiesService, validator,
  }) => {
    const handler = new PlaylistsHandler({
      playlistsService, playlistSongsService,
      playlistSongActivitiesService, validator,
    });

    server.route(routes(handler));
  },
};
