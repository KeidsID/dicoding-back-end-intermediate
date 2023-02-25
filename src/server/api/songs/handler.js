/* eslint-disable no-unused-vars */
// For VsCode-JSDoc purpose.
const Hapi = require('@hapi/hapi');
const SongsService = require('../../services/SongsService');
const Validator = require('../../validators/songs');

/**
 * Request handlers for `/songs` endpoint.
 */
class SongsHandler {
  #service;
  #validator;

  /**
   * @param {SongsService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /songs` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {InvariantError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postSong(req, h) {
    this.#validator.validatePayload(req.payload);

    const songId = await this.#service.addSong(req.payload);

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
   * @param {Hapi.Request} req
   *
   * @throws {NotFoundError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getSongs(req) {
    const songs = await this.#service.getSongs(req.query);

    return {
      status: 'success',
      data: {songs},
    };
  }

  /**
   * Handler for `GET /songs/{id}` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {NotFoundError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getSongById(req) {
    const {id} = req.params;

    const song = await this.#service.getSongById(id);

    return {
      status: 'success',
      data: {song},
    };
  }

  /**
   * Handler for `PUT /songs/{id}` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async putSongById(req) {
    this.#validator.validatePayload(req.payload);

    const {id} = req.params;

    await this.#service.editSongById(id, req.payload);

    return {
      status: 'success',
      message: 'Song updated',
    };
  }

  /**
   * Handler for `DELETE /songs/{id}` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteSongById(req) {
    const {id} = req.params;

    await this.#service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song deleted',
    };
  }
}

module.exports = SongsHandler;
