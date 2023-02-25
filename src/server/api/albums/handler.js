/* eslint-disable no-unused-vars */
// VsCode-JSDoc purpose
const Hapi = require('@hapi/hapi');
const AlbumsService = require('../../services/AlbumsService');
const Validator = require('../../validators/albums');

/**
 * Request handlers for `/albums` endpoints.
 */
class AlbumsHandler {
  #service;
  #validator;

  /**
   * @param {AlbumsService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this.#service = service;
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
    this.#validator.validatePayload(req.payload);

    const albumId = await this.#service.addAlbum(req.payload);

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

    const album = await this.#service.getAlbumById(id);

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
    this.#validator.validatePayload(req.payload);

    const {id} = req.params;

    await this.#service.editAlbumById(id, req.payload);

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

    await this.#service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted',
    };
  }
}

module.exports = AlbumsHandler;
