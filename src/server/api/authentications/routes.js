/* eslint-disable no-unused-vars */

const PATH_AUTHENTICATIONS = '/authentications';

// For VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const AuthenticationsHandler = require('./handler');

/**
 * Function to return routes for `/authentications` endpoint.
 *
 * @param {AuthenticationsHandler} handler
 * @return {Hapi.ServerRoute[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_AUTHENTICATIONS,
    handler: (req, h) => handler.postAuth(req, h),
  },
  {
    method: 'PUT', path: PATH_AUTHENTICATIONS,
    handler: (req) => handler.putAuth(req),
  },
  {
    method: 'DELETE', path: PATH_AUTHENTICATIONS,
    handler: (req) => handler.deleteAuth(req),
  },
];


module.exports = routes;
