/* eslint-disable no-unused-vars */
const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const AuthenticationsService = require('../../services/AuthenticationsService');
const UsersService = require('../../services/UsersService');
const TokenManager = require('../../tokenize/TokenManager');
const validator = require('../../validators/authentications');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {AuthenticationsService} options.authenticationsService
   * @param {UsersService} options.usersService
   * @param {TokenManager} options.tokenManager
   * @param {validator} options.validator
   */
  register: async (server, {
    authenticationsService, usersService,
    tokenManager, validator,
  }) => {
    const handler = new AuthenticationsHandler({
      authenticationsService, usersService,
      tokenManager, validator,
    });

    server.route(routes(handler));
  },
};
