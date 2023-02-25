/* eslint-disable no-unused-vars */

const PATH_COLLABORATIONS = '/collaborations';

// For VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const {userIdAuthStrategy} = require('../../../common/constants');
const CollaborationsHandler = require('./handler');

/**
 * Function to return routes for `/collaborations` endpoint.
 *
 * @param {CollaborationsHandler} handler
 * @return {Hapi.ServerRoute[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_COLLABORATIONS,
    handler: (req, h) => handler.postCollab(req, h),
    options: {auth: userIdAuthStrategy},
  },
  {
    method: 'DELETE', path: PATH_COLLABORATIONS,
    handler: (req) => handler.deleteCollab(req),
    options: {auth: userIdAuthStrategy},
  },
];

module.exports = routes;
