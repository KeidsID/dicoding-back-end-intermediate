/* eslint-disable no-unused-vars */
const ClientError = require('../../common/errors/ClientError');

// VsCode-JsDoc purpose
const Hapi = require('@hapi/hapi');

/**
 * Handler for `Hapi.Server.ext("onPreResponse")`.
 *
 * This handler will catch Errors from any previous handlers.
 *
 * @param {Hapi.Request} req - Request object with response from previous routes
 * @param {Hapi.ResponseToolkit} h
 * @return {Hapi.ResponseObject}
 */
const onPreResponseHandler = (req, h) => {
  const {response} = req;

  if (response instanceof Error) {
    if (response instanceof ClientError) {
      const clientErrorsResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      clientErrorsResponse.code(response.statusCode);

      return clientErrorsResponse;
    }

    if (!response.isServer) {
      return h.continue;
    }

    const unknownErrorsResponse = h.response({
      status: 'error',
      message: 'Server fail. Sorry for the inconvenience',
      error: {
        name: response.name,
        message: response.message,
      },
    });
    unknownErrorsResponse.code(500);

    return unknownErrorsResponse;
  }

  return h.continue;
};

module.exports = onPreResponseHandler;
