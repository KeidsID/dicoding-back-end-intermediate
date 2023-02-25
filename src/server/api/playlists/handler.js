/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const PlaylistsService = require('../../services/db/PlaylistsService');
const PlaylistSongsService = require('../../services/db/PlaylistSongsService');
const PlaylistSongActivitiesService = require(
    '../../services/db/PlaylistSongActivitiesService');
const validator = require('../../validators/playlists');

/**
 * Request handlers for `/playlists` endpoint.
 */
class PlaylistsHandler {
  #playlistsService;
  #playlistSongsService;
  #playlistSongActivitiesService;
  #validator;

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
    this.#playlistsService = playlistsService;
    this.#playlistSongsService = playlistSongsService;
    this.#playlistSongActivitiesService = playlistSongActivitiesService;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /playlists` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postPlaylist(req, h) {
    this.#validator.validatePostPlaylistPayload(req.payload);

    const {id: authId} = req.auth.credentials;

    const playlistId = await this.#playlistsService.addPlaylist(
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
   * Handler for `GET /playlists` request.
   *
   * @param {Hapi.Request} req
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getPlaylists(req) {
    const {id: authId} = req.auth.credentials;

    const playlists = await this.#playlistsService.getPlaylists(authId);

    return {
      status: 'success',
      data: {playlists},
    };
  }

  /**
   * Handler for `DELETE /playlists/{id}` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deletePlaylistById(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this.#playlistsService.verifyPlaylistOwner(id, authId);
    await this.#playlistsService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist Deleted',
    };
  }

  /**
   * Handler for `POST /playlists/{id}/songs` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postSongToPlaylist(req, h) {
    this.#validator.validatePostPlaylistsSongsPayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {id} = req.params;
    const {songId} = req.payload;

    await this.#playlistsService.verifyPlaylistAccess(id, authId);
    await this.#playlistSongsService.addSongToPlaylist(id, req.payload);
    await this.#playlistSongActivitiesService.recordAddSong(id, authId, songId);

    const response = h.response({
      status: 'success',
      message: 'Song added to Playlist',
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for `GET /playlists/{id}/songs` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getSongsFromPlaylists(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this.#playlistsService.verifyPlaylistAccess(id, authId);

    const playlist = await this.#playlistsService.getPlaylistById(id);
    playlist['songs'] = await this.#playlistSongsService
        .getSongsFromPlaylist(id);

    return {
      status: 'success',
      data: {playlist},
    };
  }

  /**
   * Handler for `DELETE /playlists/{id}/songs` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteSongFromPlaylists(req) {
    this.#validator.validateDeletePlaylistsSongsPayload(req.payload);

    const {id: authId} = req.auth.credentials;
    const {id} = req.params;
    const {songId} = req.payload;

    await this.#playlistsService.verifyPlaylistAccess(id, authId);
    await this.#playlistSongsService.deleteSongFromPlaylist(id, req.payload);
    await this.#playlistSongActivitiesService.recordDeleteSong(
        id, authId, songId,
    );

    return {
      status: 'success',
      message: 'Song deleted from Playlist',
    };
  }

  /**
   * Handler for `GET /playlists/{id}/activities` request.
   *
   * @param {Hapi.Request} req
   *
   * @throws {ClientError}
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getPlaylistSongActivities(req) {
    const {id: authId} = req.auth.credentials;
    const {id} = req.params;

    await this.#playlistsService.verifyPlaylistAccess(id, authId);

    const activities = await this.#playlistSongActivitiesService
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
