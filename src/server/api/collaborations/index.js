/* eslint-disable no-unused-vars */
const CollaboraionsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const Validator = require('../../validators/collaborations');

/**
 * Hapi Plugin for `/collaborations` endpoint.
 */
module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  /**
   * @param {Hapi.Server} server - Hapi.Server
   *
   * @param {object} options
   * @param {CollaboraionsService} options.collaborationsService
   * @param {PlaylistsService} options.playlistsService
   * @param {Validator} options.validator
   */
  register: async (server, options) => {
    const handler = new CollaboraionsHandler(options);

    server.route(routes(handler));
  },
};
