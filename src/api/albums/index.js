const AlbumsHandler = require('./handler');
const routes = require('./routes');

// For JSDoc purpose
// eslint-disable-next-line no-unused-vars
const AlbumsService = require('../../services/AlbumsService');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {AlbumsService} options.service
   */
  register: async (server, {service}) => {
    const handler = new AlbumsHandler(service);

    server.route(routes(handler));
  },
};
