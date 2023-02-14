/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const CollaborationsService = require('../../services/CollaborationsService');
const PlaylistsService = require('../../services/PlaylistsService');
const Validator = require('../../validators/collaborations');

/**
 * Handler for "/collaborations" endpoint.
 */
class CollaborationsHandler {
  /**
   * @param {object} utils
   * @param {CollaborationsService} utils.collaborationsService
   * @param {PlaylistsService} utils.playlistsService
   * @param {Validator} utils.validator
   */
  constructor({
    collaborationsService, playlistsService, validator,
  }) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  /**
   * Add collaborator to playlist.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {Promise<object>} Server Response
   */
  async postCollab(req, h) {
    this._validator.validatePayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {playlistId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, authId);

    const collaborationId = await this._collaborationsService.addCollab(
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
   * Delete collaborator from playlist.
   *
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async deleteCollab(req) {
    this._validator.validatePayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {playlistId} = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, authId);
    await this._collaborationsService.deleteCollab(req.payload);

    return {
      status: 'success',
      message: 'Collaborator Removed',
    };
  }
}

module.exports = CollaborationsHandler;
