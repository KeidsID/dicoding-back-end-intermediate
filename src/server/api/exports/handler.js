/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');

const PlaylistsService = require('../../services/db/PlaylistsService');
const ProducerService = require('../../services/mq/ProducerService');
const validator = require('../../validators/exports');

/**
 * Request handlers for `/playlists` endpoint.
 */
class ExportsHandler {
  #producerService;
  #playlistsService;
  #validator;

  /**
   * @param {object} utils
   * @param {ProducerService} utils.producerService
   * @param {PlaylistsService} utils.playlistsService
   * @param {validator} utils.validator
   */
  constructor({
    producerService, playlistsService,
    validator,
  }) {
    this.#producerService = producerService;
    this.#playlistsService = playlistsService;
    this.#validator = validator;
  }

  #playlistQueue = 'export:playlist';

  /**
   * Handler for `POST /export/playlists/{id}` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postExportPlaylistById(req, h) {
    this.#validator.validatePostPlaylistsPayload(req.payload);

    const {id} = req.params;
    const {id: authId} = req.auth.credentials;
    const {targetEmail} = req.payload;

    await this.#playlistsService.verifyPlaylistOwner(id, authId);

    const msg = {
      playlistId: id,
      targetEmail,
    };

    await this.#producerService.sendMsg(
        this.#playlistQueue, JSON.stringify(msg),
    );

    const response = h.response({
      status: 'success',
      message: `Playlist has been sent to ${targetEmail}`,
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
