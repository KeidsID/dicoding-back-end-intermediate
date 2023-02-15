/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const PlaylistsService = require('../../services/PlaylistsService');
const PlaylistSongsService = require('../../services/PlaylistSongsService');
const PlaylistSongActivitiesService = require(
    '../../services/PlaylistSongActivitiesService');
const validator = require('../../validators/playlists');

/**
 * Handlers for "/playlists" endpoint.
 */
class PlaylistsHandler {
  /**
   * @param {object} utils
   * @param {PlaylistsService} utils.playlistsService
   * @param {PlaylistSongsService} utils.playlistSongsService
   * @param {PlaylistSongActivitiesService} utils.playlistSongActivitiesService
   * @param {validator} utils.validator
   */
  constructor({
    playlistsService, playlistSongsService,
    playlistSongActivitiesService, validator,
  }) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;
  }

  /**
   * Handler for "POST /playlists" endpoint.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {Promise<object>} Server Response
   */
  async postPlaylist(req, h) {
    this._validator.validatePostPlaylistPayload(req.payload);

    const {id: authId} = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
        authId, req.payload,
    );

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
   * @return {Promise<object>} Server Response
   */
  async getPlaylists(req) {
    const {id: authId} = req.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(authId);

    return {
      status: 'success',
      data: {playlists},
    };
  }

  /**
   * Handler for "DELETE /playlists/{id}" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async deletePlaylistById(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this._playlistsService.verifyPlaylistOwner(id, authId);
    await this._playlistsService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist Deleted',
    };
  }

  /**
   * Handler for "POST /playlists/{id}/songs" endpoint.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {Promise<object>} Server Response
   */
  async postSongToPlaylist(req, h) {
    this._validator.validatePostPlaylistsSongsPayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {id} = req.params;
    const {songId} = req.payload;

    await this._playlistsService.verifyPlaylistAccess(id, authId);
    await this._playlistSongsService.addSongToPlaylist(id, req.payload);
    await this._playlistSongActivitiesService.recordAddSong(id, authId, songId);

    const response = h.response({
      status: 'success',
      message: 'Song added to Playlist',
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for "GET /playlists/{id}/songs" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async getSongsFromPlaylists(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this._playlistsService.verifyPlaylistAccess(id, authId);

    const playlist = await this._playlistsService.getPlaylistById(id);
    playlist['songs'] = await this._playlistSongsService
        .getSongsFromPlaylist(id);

    return {
      status: 'success',
      data: {playlist},
    };
  }

  /**
   * Handler for "DELETE /playlists/{id}/songs" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async deleteSongFromPlaylists(req) {
    this._validator.validateDeletePlaylistsSongsPayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {id} = req.params;
    const {songId} = req.payload;

    await this._playlistsService.verifyPlaylistAccess(id, authId);
    await this._playlistSongsService.deleteSongFromPlaylist(id, req.payload);
    await this._playlistSongActivitiesService.recordDeleteSong(
        id, authId, songId,
    );

    return {
      status: 'success',
      message: 'Song deleted from Playlist',
    };
  }

  /**
   * Handler for "GET /playlists/{id}/activities" endpoint.
   *
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async getPlaylistSongActivities(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this._playlistsService.verifyPlaylistAccess(id, authId);

    const activities = await this._playlistSongActivitiesService
        .getPlaylistActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
