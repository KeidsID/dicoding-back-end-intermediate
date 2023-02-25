/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const CollaborationsService = require('../../services/CollaborationsService');
const PlaylistsService = require('../../services/PlaylistsService');
const Validator = require('../../validators/collaborations');

/**
 * Request handlers for `/collaborations` endpoint.
 */
class CollaborationsHandler {
  #collabsService;
  #playlistsService;
  #validator;

  /**
   * @param {object} utils
   * @param {CollaborationsService} utils.collaborationsService
   * @param {PlaylistsService} utils.playlistsService
   * @param {Validator} utils.validator
   */
  constructor({
    collaborationsService, playlistsService, validator,
  }) {
    this.#collabsService = collaborationsService;
    this.#playlistsService = playlistsService;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /collaborations` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postCollab(req, h) {
    this.#validator.validatePayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {playlistId} = req.payload;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, authId);

    const collaborationId = await this.#collabsService.addCollab(
        req.payload,
    );

    const response = h.response({
      status: 'success',
      data: {collaborationId},
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for `DELETE /collaborations` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteCollab(req) {
    this.#validator.validatePayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {playlistId} = req.payload;

    await this.#playlistsService.verifyPlaylistOwner(playlistId, authId);
    await this.#collabsService.deleteCollab(req.payload);

    return {
      status: 'success',
      message: 'Collaborator Removed',
    };
  }
}

module.exports = CollaborationsHandler;
