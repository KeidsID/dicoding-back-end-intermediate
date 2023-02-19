/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const UsersService = require('../../services/UsersService');
const Validator = require('../../validators/users');

/**
 * Request handlers for `/users` endpoint.
 */
class UsersHandler {
  /**
   * @param {UsersService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  /**
   * Handler for `POST /users` request.
   *
   * @param {object} req - Client Request object
   * @param {object} h - Hapi Response Toolkit
   *
   * @return {Promise<object>} Server Response
   */
  async postUser(req, h) {
    this._validator.validatePayload(req.payload);

    const userId = await this._service.addUser(req.payload);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);

    return response;
  }
}

module.exports = UsersHandler;
