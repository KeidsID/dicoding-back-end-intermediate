/* eslint-disable no-unused-vars */

const configs = require('../../../common/utils/configs');

// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const AlbumsService = require('../../services/db/AlbumsService');
const StorageService = require('../../services/storage/StorageService');
const Validator = require('../../validators/albums');

/**
 * Request handlers for `/albums` endpoints.
 */
class AlbumsHandler {
  #albumsService;
  #storageService;
  #validator;

  /**
   * @param {AlbumsService} albumsService
   * @param {StorageService} storageService
   * @param {Validator} validator
   */
  constructor(albumsService, storageService, validator) {
    this.#albumsService = albumsService;
    this.#storageService = storageService;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /albums` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {InvariantError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postAlbum(req, h) {
    this.#validator.validatePostAlbumPayload(req.payload);

    const albumId = await this.#albumsService.addAlbum(req.payload);

    const response = h.response({
      status: 'success',
      data: {albumId},
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for `GET /albums/{id}` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {NotFoundError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getAlbumById(req) {
    const {id} = req.params;

    const album = await this.#albumsService.getAlbumById(id);

    return {
      status: 'success',
      data: {album},
    };
  }

  /**
   * Handler for `PUT /albums/{id}` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {NotFoundError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async putAlbumById(req) {
    this.#validator.validatePostAlbumPayload(req.payload);

    const {id} = req.params;

    await this.#albumsService.editAlbumById(id, req.payload);

    return {
      status: 'success',
      message: 'Album updated',
    };
  }

  /**
   * Handler for `DELETE /albums/{id}` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {NotFoundError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteAlbumById(req) {
    const {id} = req.params;

    await this.#albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted',
    };
  }

  /**
   * Handler for `POST /albums/{id}/covers` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postAlbumCover(req, h) {
    const baseUrl = `http://${configs.server.host}:${configs.server.port}/albums`;

    const {id} = req.params;
    const {cover} = req.payload;

    this.#validator.validatePostAlbumCoverHeader(cover.hapi.headers);

    const fileName = await this.#storageService
        .writeFile(cover, id, 'cover');

    await this.#albumsService
        .addCoverUrlOnAlbum(id, `${baseUrl}/covers/${fileName}`);

    const response = h.response({
      status: 'success',
      message: `Cover uploaded. Go to ${baseUrl}/${id} to get the cover url`,
    });
    response.code(201);

    return response;
  }
}

module.exports = AlbumsHandler;
