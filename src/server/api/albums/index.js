/* eslint-disable no-unused-vars */
const AlbumsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JSDoc purpose
const AlbumsService = require('../../services/AlbumsService');
const Validator = require('../../validators/albums');

/**
 * Hapi Plugin for `/albums` endpoint.
 */
module.exports = {
  name: 'albums',
  version: '1.0.1',
  /**
   * @param {object} server - The Hapi Server.
   *
   * @param {object} options - The options for this plugin.
   * @param {AlbumsService} options.service
   * @param {Validator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new AlbumsHandler(service, validator);

    server.route(routes(handler));
  },
};
