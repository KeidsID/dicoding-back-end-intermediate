/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const AuthenticationsService = require('../../services/AuthenticationsService');
const UsersService = require('../../services/UsersService');
const TokenManager = require('../../tokenize/TokenManager');
const Validator = require('../../validators/authentications');

/**
 * Request handlers for `/authentications` endpoint.
 */
class AuthenticationsHandler {
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
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  /**
   * Handler for `POST /authentications` request.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {Promise<object>} Server Response
   */
  async postAuth(req, h) {
    this._validator.validatePostPayload(req.payload);

    const id = await this._usersService.verifyCredential(req.payload);
    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});

    await this._authenticationsService.addToken(refreshToken);

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
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async putAuth(req) {
    this._validator.validatePutPayload(req.payload);

    const {refreshToken} = req.payload;

    await this._authenticationsService.verifyToken(refreshToken);

    const tokenPayload = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken(tokenPayload);

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
   * @param {object} req - Client Request object
   *
   * @return {Promise<object>} Server Response
   */
  async deleteAuth(req) {
    this._validator.validateDeletePayload(req.payload);

    const {refreshToken} = req.payload;

    await this._authenticationsService.verifyToken(refreshToken);
    await this._authenticationsService.deleteToken(refreshToken);

    return {
      status: 'success',
      message: 'Log Out Success',
    };
  }
}

module.exports = AuthenticationsHandler;
