const AlbumsHandler = require('./handler');
const routes = require('./routes');

// For VsCode-JSDoc purpose
// eslint-disable-next-line no-unused-vars
const AlbumsService = require('../../services/AlbumsService');
// eslint-disable-next-line no-unused-vars
const AlbumsValidator = require('../../validators/albums');

module.exports = {
  name: 'albums',
  version: '1.0.1',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {AlbumsService} options.service
   * @param {AlbumsValidator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new AlbumsHandler(service, validator);

    server.route(routes(handler));
  },
};
