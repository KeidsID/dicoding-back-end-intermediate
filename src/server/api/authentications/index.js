/* eslint-disable no-unused-vars */
const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const TokenManager = require('../../tokenize/TokenManager');
const Validator = require('../../validators/authentications');

/**
 * Hapi Plugin for `/authentications` endpoint.
 */
module.exports = {
  name: 'authentications',
  version: '1.0.0',
  /**
   * @param {Hapi.Server} server - The Hapi Server.
   *
   * @param {object} options - The options for this plugin.
   * @param {AuthenticationsService} options.authenticationsService
   * @param {UsersService} options.usersService
   * @param {TokenManager} options.tokenManager
   * @param {Validator} options.validator
   */
  register: async (server, options) => {
    const handler = new AuthenticationsHandler(options);

    server.route(routes(handler));
  },
};
