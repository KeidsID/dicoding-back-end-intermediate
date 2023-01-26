const SongsHandler = require('./handler');
const routes = require('./routes');

// For VsCode-JSDoc purpose
// eslint-disable-next-line no-unused-vars
const {SongsService} = require('../../services/SongsService');
// eslint-disable-next-line no-unused-vars
const SongsValidator = require('../../validators/songs');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {SongsService} options.service
   * @param {SongsValidator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new SongsHandler(service, validator);

    server.route(routes(handler));
  },
};
