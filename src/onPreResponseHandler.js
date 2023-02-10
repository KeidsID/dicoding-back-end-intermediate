const ClientError = require('./common/errors/ClientError');

/**
 * Handler for `Hapi.Server.ext("onPreResponse")`.
 *
 * @param {object} req - Request object with response from Server.routes
 * @param {object} h - Hapi Response Toolkit
 * @return {object} Server Response
 */
const onPreResponseHandler = (req, h) => {
  const {response} = req;

  if (response instanceof Error) {
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);

      return newResponse;
    }

    if (!response.isServer) {
      return h.continue;
    }

    const newResponse = h.response({
      status: 'error',
      message: 'Server fail. Sorry for the inconvenience',
    });
    newResponse.code(500);

    return newResponse;
  }

  return h.continue;
};

module.exports = onPreResponseHandler;
