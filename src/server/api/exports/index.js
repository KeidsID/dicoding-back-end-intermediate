/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const ExportsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');

const ProducerService = require('../../services/mq/ProducerService');
const Validator = require('../../validators/playlists');

/**
 * Hapi Plugin for `/export` endpoint.
 */
module.exports = {
  name: 'exports',
  version: '1.0.0',
  /**
   * @param {Hapi.Server} server
   *
   * @param {object} options - The options for this plugin.
   * @param {ProducerService} options.producerService
   * @param {PlaylistsService} options.playlistsService
   * @param {Validator} options.validator
   */
  register: async (server, options) => {
    const handler = new ExportsHandler(options);

    server.route(routes(handler));
  },
};
