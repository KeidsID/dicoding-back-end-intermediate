// For VsCode-JSDoc purpose.
// eslint-disable-next-line no-unused-vars
const SongsService = require('../../services/SongsService');
// eslint-disable-next-line no-unused-vars
const Validator = require('../../validators/songs');

/**
 * Request handlers for `/songs` endpoint.
 */
class SongsHandler {
  /**
   * @param {SongsService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Handler for `POST /songs` request.
   *
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {InvariantError}
   * @return {Promise<object>} Server Response
   */
  async postSong(req, h) {
    this._validator.validatePayload(req.payload);

    const songId = await this._service.addSong(req.payload);

    const response = h.response({
      status: 'success',
      data: {songId},
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for `GET /songs` request.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Server Response
   */
  async getSongs(req) {
    const songs = await this._service.getSongs(req.query);

    return {
      status: 'success',
      data: {songs},
    };
  }

  /**
   * Handler for `GET /songs/{id}` request.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {NotFoundError}
   * @return {Promise<object>} Server Response
   */
  async getSongById(req) {
    const {id} = req.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {song},
    };
  }

  /**
   * Handler for `PUT /songs/{id}` request.
   *
   * @param {object} req - The Hapi request object.
   * @param {object} h - The Hapi response toolkit.
   *
   * @throws {ClientError}
   * @return {Promise<object>} Server Response
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
   * Handler for `DELETE /songs/{id}` request.
   *
   * @param {object} req - The Hapi request object.
   *
   * @throws {ClientError}
   * @return {Promise<object>} Server Response
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
