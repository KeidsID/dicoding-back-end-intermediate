/* eslint-disable no-unused-vars */
const UsersHandler = require('./handler');
const routes = require('./routes');

// VsCode-JsDoc purpose
const UsersService = require('../../services/UsersService');
const validator = require('../../validators/users');

module.exports = {
  name: 'users',
  version: '1.0.0',
  /**
   * @param {object} server - The Hapi Server.
   * @param {object} options - The options for this plugin.
   * @param {UsersService} options.service
   * @param {validator} options.validator
   */
  register: async (server, {service, validator}) => {
    const handler = new UsersHandler(service, validator);

    server.route(routes(handler));
  },
};