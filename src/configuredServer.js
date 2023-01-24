const Hapi = require('@hapi/hapi');

const ClientError = require('./common/errors/ClientError');

const configuredServer = () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 5000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (req, h) => {
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
  });

  return server;
};

module.exports = configuredServer;
