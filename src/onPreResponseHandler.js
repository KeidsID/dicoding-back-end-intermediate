const ClientError = require('./common/errors/ClientError');

/**
 * Handler for `Hapi.Server.ext("onPreResponse")`.
 *
 * This handler will catch Errors from any handlers.
 *
 * @param {object} req - Request object with response from Server.routes
 * @param {object} h - Hapi Response Toolkit
 * @return {object} Server Response
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
      error: response.message,
    });
    unknownErrorsResponse.code(500);

    return unknownErrorsResponse;
  }

  return h.continue;
};

module.exports = onPreResponseHandler;
