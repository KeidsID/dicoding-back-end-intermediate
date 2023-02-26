/* eslint-disable no-unused-vars */
const path = require('path');

const PATH_ALBUMS = '/albums';

// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const AlbumsHandler = require('./handler');

/**
 * Function to return routes for `/albums` endpoint.
 *
 * @param {AlbumsHandler} handler
 * @return {Hapi.ServerRoute[]} The routes for server.
 */
const routes = (handler) => [
  {
    method: 'POST', path: PATH_ALBUMS,
    handler: (req, h) => handler.postAlbum(req, h),
  },
  {
    method: 'GET', path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.getAlbumById(req),
  },
  {
    method: 'PUT', path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.putAlbumById(req),
  },
  {
    method: 'DELETE', path: `${PATH_ALBUMS}/{id}`,
    handler: (req) => handler.deleteAlbumById(req),
  },
  {
    method: 'POST', path: `${PATH_ALBUMS}/{id}/covers`,
    handler: (req, h) => handler.postAlbumCover(req, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET', path: `${PATH_ALBUMS}/{param*}`,
    handler: {
      directory: {
        path: path.resolve(__dirname, 'fs'),
      },
    },
  },
];

module.exports = routes;
