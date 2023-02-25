/* eslint-disable no-unused-vars */
// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');
const UsersService = require('../../services/db/UsersService');
const Validator = require('../../validators/users');

/**
 * Request handlers for `/users` endpoint.
 */
class UsersHandler {
  #service;
  #validator;

  /**
   * @param {UsersService} service
   * @param {Validator} validator
   */
  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;
  }

  /**
   * Handler for `POST /users` request.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postUser(req, h) {
    this.#validator.validatePayload(req.payload);

    const userId = await this.#service.addUser(req.payload);

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
