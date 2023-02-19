/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose
const {playlistAuthStrategy} = require('../../../common/constants');
const CollaborationsHandler = require('./handler');

const PATH_COLLABORATIONS = '/collaborations';

/**
 * Function to return routes for `/collaborations` endpoint.
 *
 * @param {CollaborationsHandler} handler
 * @return {object[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_COLLABORATIONS,
    handler: (req, h) => handler.postCollab(req, h),
    options: {auth: playlistAuthStrategy},
  },
  {
    method: 'DELETE', path: PATH_COLLABORATIONS,
    handler: (req) => handler.deleteCollab(req),
    options: {auth: playlistAuthStrategy},
  },
];

module.exports = routes;
