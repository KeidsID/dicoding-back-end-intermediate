// For VsCode-JSDoc purpose.
// eslint-disable-next-line no-unused-vars
const SongsService = require('../../services/SongsService');
// eslint-disable-next-line no-unused-vars
const SongsValidator = require('../../validators/songs');

/**
 * Handler for Songs endpoints request.
 */
class SongsHandler {
  /**
   * Handler for Songs endpoints request.
   *
   * @param {SongsService} service - An instance of SongsService.
   * @param {SongsValidator} validator - An instance of SongsValidator.
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Create and add Song object to server.
   *
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {InvariantError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
   */
  async postSong(req, h) {
    this._validator.validatePayload(req.payload);

    const songId = await this._service.addSong(req.payload);
    const response = h.response({
      status: 'success',
      data: {
        songId: songId,
      },
    });

    response.code(201);

    return response;
  }

  /**
   * Get Array of Song object from server based on the requested id.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object[]>} The response object.
   */
  async getSongs(req) {
    const songs = await this._service.getSongs(req.query);

    return {
      status: 'success',
      data: {
        songs: songs,
      },
    };
  }

  /**
   * Get Song object from server based on the requested id.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
   */
  async getSongById(req) {
    const {id} = req.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song: song,
      },
    };
  }

  /**
   * Create and add Song object to server.
   *
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
   */
  async putSongById(req) {
    this._validator.validatePayload(req.payload);

    const {id} = req.params;

    await this._service.editSongById(id, req.payload);

    return {
      status: 'success',
      message: 'Song updated',
    };
  }

  /**
   * Create and add Song object to server.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError} The type of Error that may be thrown
   * @return {Promise<object>} The response object.
   */
  async deleteSongById(req) {
    const {id} = req.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song deleted',
    };
  }
}

module.exports = SongsHandler;
