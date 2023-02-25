/* eslint-disable no-unused-vars */
const SongsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const SongsService = require('../../services/SongsService');
const Validator = require('../../validators/songs');

/**
 * Hapi Plugin for `/songs` endpoint.
 */
module.exports = {
  name: 'songs',
  version: '1.0.1',
  /**
   * @param {Hapi.Server} server
   *
   * @param {object} options - The options for this plugin.
   * @param {SongsService} options.service
   * @param {Validator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new SongsHandler(service, validator);

    server.route(routes(handler));
  },
};
