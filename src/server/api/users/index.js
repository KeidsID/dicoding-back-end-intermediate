/* eslint-disable no-unused-vars */
const UsersHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const Validator = require('../../validators/users');

/**
 * Hapi Plugin for `/users` endpoint.
 */
module.exports = {
  name: 'users',
  version: '1.0.0',
  /**
   * @param {Hapi.Server} server
   *
   * @param {object} options - The options for this plugin.
   * @param {UsersService} options.service
   * @param {Validator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new UsersHandler(service, validator);

    server.route(routes(handler));
  },
};
