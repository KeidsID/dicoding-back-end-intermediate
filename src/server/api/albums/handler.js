/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose.
const AlbumsService = require('../../services/AlbumsService');
const AlbumsValidator = require('../../validators/albums');

/**
 * Handler for "/albums" endpoint.
 */
class AlbumsHandler {
  /**
   * @param {AlbumsService} service - An instance of AlbumsService.
   * @param {AlbumsValidator} validator - An instance of AlbumsValidator.
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Create and add Album object to server.
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
      data: {
        albumId: albumId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * Get Album object from server based on the requested id.
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
      data: {
        album: album,
      },
    };
  }

  /**
   * Create and add Album object to server.
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
   * Create and add Album object to server.
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
