
// For VsCode-JSDoc purpose.
// eslint-disable-next-line no-unused-vars
const AlbumsService = require('../../services/AlbumsService');

/**
 * Handler for Albums endpoints request.
 */
class AlbumsHandler {
  /**
   * Handler for Albums endpoints request.
   *
   * @param {AlbumsService} service - An instance of AlbumsService
   */
  constructor(service) {
    this._service = service;
  }

  /**
   * Create and add Album object to server.
   *
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {InvariantError} The type of Error that may be thrown
   * @return {object} The response object.
   */
  postAlbum(req, h) {
    const {name, year} = req.payload;
    const albumId = this._service.addAlbum({name, year});

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
   * @return {object} The response object.
   */
  getAlbumById(req) {
    const {id} = req.params;

    const album = this._service.getAlbumById(id);

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
   * @return {object} The response object.
   */
  putAlbumById(req) {
    const {id} = req.params;
    const {name, year} = req.payload;
    this._service.editAlbumById(id, {name, year});


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
   * @return {object} The response object.
   */
  deleteAlbumById(req) {
    const {id} = req.params;

    this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album deleted',
    };
  }
}

module.exports = AlbumsHandler;
