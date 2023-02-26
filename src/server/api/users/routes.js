/* eslint-disable no-unused-vars */
const PATH_USERS = '/users';

// For VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const SongsHandler = require('./handler');

/**
 * Function to return routes for `/users` endpoint.
 *
 * @param {SongsHandler} handler
 * @return {Hapi.ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_USERS,
    handler: (req, h) => handler.postUser(req, h),
  },
];


module.exports = routes;
