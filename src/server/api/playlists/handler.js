/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const PlaylistsService = require('../../services/PlaylistsService');
const validator = require('../../validators/playlists');

/**
 * Handlers for "/playlists" endpoint.
 */
class PlaylistsHandler {
  /**
   * @param {object} utils
   * @param {PlaylistsService} utils.playlistsService
   * @param {validator} utils.validator
   */
  constructor({
    playlistsService, validator,
  }) {
    this._playlistService = playlistsService;
    this._validator = validator;
  }

  /**
   * Handler for "POST /playlists" endpoint.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {object} Server Response
   */
  async postPlaylist(req, h) {
    this._validator.validatePostPlaylistPayload(req.payload);

    const {id: authId} = req.auth.credentials;

    const playlistId =
      await this._playlistService.addPlaylist(authId, req.payload);

    const response = h.response({
      status: 'success',
      data: {playlistId},
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for "GET /playlists" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {object} Server Response
   */
  async getPlaylists(req) {
    const {id: authId} = req.auth.credentials;

    const playlists = await this._playlistService.getPlaylists(authId);

    return {
      status: 'success',
      data: {playlists},
    };
  }

  /**
   * Handler for "DELETE /playlists" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {object} Server Response
   */
  async deletePlaylistById(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this._playlistService.verifyPlaylistOwner(id, authId);
    await this._playlistService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist Deleted',
    };
  }
}

module.exports = PlaylistsHandler;
