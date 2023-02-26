/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const AuthenticationsService = require(
    '../../services/db/AuthenticationsService');
const UsersService = require('../../services/db/UsersService');
const TokenManager = require('../../tokenize/TokenManager');
const Validator = require('../../validators/authentications');

/**
 * Request handlers for `/authentications` endpoint.
 */
class AuthenticationsHandler {
  #authService;
  #usersService;
  #tokenManager;
  #validator;

  /**
   * @param {object} utils
   * @param {AuthenticationsService} utils.authenticationsService
   * @param {UsersService} utils.usersService
   * @param {TokenManager} utils.tokenManager
   * @param {Validator} utils.validator
   */
  constructor({
    authenticationsService, usersService,
    tokenManager, validator,
  }) {
    this.#authService = authenticationsService;
    this.#usersService = usersService;
    this.#tokenManager = tokenManager;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /authentications` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postAuth(req, h) {
    this.#validator.validatePostPayload(req.payload);

    const id = await this.#usersService.verifyCredential(req.payload);
    const accessToken = this.#tokenManager.generateAccessToken({id});
    const refreshToken = this.#tokenManager.generateRefreshToken({id});

    await this.#authService.addToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * Handler for `PUT /authentications` request.
   *
   * @param {Hapi.Request} req
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async putAuth(req) {
    this.#validator.validatePutPayload(req.payload);

    const {refreshToken} = req.payload;

    await this.#authService.verifyToken(refreshToken);

    const tokenPayload = this.#tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.#tokenManager.generateAccessToken(tokenPayload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  /**
   * Handler for `DELETE /authentications` request.
   *
   * @param {Hapi.Request} req
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteAuth(req) {
    this.#validator.validateDeletePayload(req.payload);

    const {refreshToken} = req.payload;

    await this.#authService.verifyToken(refreshToken);
    await this.#authService.deleteToken(refreshToken);

    return {
      status: 'success',
      message: 'Log Out Success',
    };
  }
}

module.exports = AuthenticationsHandler;
