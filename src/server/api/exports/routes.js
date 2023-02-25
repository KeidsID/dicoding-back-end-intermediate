/* eslint-disable no-unused-vars */
const PATH_EXPORT = '/export';

// For VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const {userIdAuthStrategy} = require('../../../common/constants');
const ExportsHandler = require('./handler');

/**
 * Function to return server routes for `/export` endpoint.
 *
 * @param {ExportsHandler} handler
 * @return {Hapi.ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: 'POST', path: `${PATH_EXPORT}/playlists/{id}`,
    handler: (req, h) => handler.postExportPlaylistById(req, h),
    options: {auth: userIdAuthStrategy},
  },
];


module.exports = routes;
