/* eslint-disable no-unused-vars */
const CollaboraionsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Validator = require('../../validators/collaborations');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  /**
   * @param {object} server - Hapi.Server
   * @param {object} options
   * @param {CollaboraionsService} options.collaborationsService
   * @param {PlaylistsService} options.playlistsService
   * @param {Validator} options.validator
   */
  register: async (server, {
    collaborationsService, playlistsService, validator,
  }) => {
    const handler = new CollaboraionsHandler({
      collaborationsService, playlistsService, validator,
    });

    server.route(routes(handler));
  },
};
