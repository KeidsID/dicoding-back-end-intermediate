// For VsCode-JSDoc purpose.
// eslint-disable-next-line no-unused-vars
const AlbumsService = require('../../services/AlbumsService');
// eslint-disable-next-line no-unused-vars
const AlbumsValidator = require('../../validators/albums');

/**
 * Handler for Albums endpoints request.
 */
class AlbumsHandler {
  /**
   * Handler for Albums endpoints request.
   *
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
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {InvariantError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
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
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
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
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
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
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
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
