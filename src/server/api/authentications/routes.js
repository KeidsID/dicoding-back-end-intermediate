/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose
const AuthenticationsHandler = require('./handler');

const PATH_AUTHENTICATIONS = '/authentications';

/**
 * @param {AuthenticationsHandler} handler
 * @return {object[]} The routes for server.
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
