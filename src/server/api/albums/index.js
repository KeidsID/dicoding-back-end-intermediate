/* eslint-disable no-unused-vars */
const AlbumsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const Validator = require('../../validators/albums');

/**
 * Hapi Plugin for `/albums` endpoint.
 */
module.exports = {
  name: 'albums',
  version: '1.0.1',
  /**
   * @param {Hapi.Server} server
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
