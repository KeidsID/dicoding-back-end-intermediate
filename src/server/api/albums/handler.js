/* eslint-disable no-unused-vars */
// VsCode-JSDoc purpose
const AlbumsService = require('../../services/AlbumsService');
const Validator = require('../../validators/albums');

/**
 * Request handlers for `/albums` endpoints.
 */
class AlbumsHandler {
  /**
   * @param {AlbumsService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Handler for `POST /albums` request.
   *
   * @param {object} req - The Hapi request object
   * @param {object} h - The Hapi response toolkit
   *
   * @throws {InvariantError}
   * @return {Promise<object>} Server Response
   */
  async postAlbum(req, h) {
    this._validator.validatePayload(req.payload);

    const albumId = await this._service.addAlbum(req.payload);

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
   * @param {object} req - The Hapi request object
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Server Response
   */
  async getAlbumById(req) {
    const {id} = req.params;

    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {album},
    };
  }

  /**
   * Handler for `PUT /albums/{id}` request.
   *
   * @param {object} req - The Hapi request object
   * @param {object} h - The Hapi response toolkit
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Server Response
   */
  async putAlbumById(req) {
    this._validator.validatePayload(req.payload);

    const {id} = req.params;

    await this._service.editAlbumById(id, req.payload);

    return {
      status: 'success',
      message: 'Album updated',
    };
  }

  /**
   * Handler for `DELETE /albums/{id}` request.
   *
   * @param {object} req - The Hapi request object
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Server Response
   */
  async deleteAlbumById(req) {
    const {id} = req.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted',
    };
  }
}

module.exports = AlbumsHandler;
