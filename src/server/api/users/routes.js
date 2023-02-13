/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose
const SongsHandler = require('./handler');

const PATH_USERS = '/users';

/**
 * @param {SongsHandler} handler
 * @return {object[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_USERS,
    handler: (req, h) => handler.postUser(req, h),
  },
];


module.exports = routes;
