const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const {playlistAuthStrategy} = require('./common/constants');

const onPreResponseHandler = require('./onPreResponseHandler');

const configuredServer = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {plugin: Jwt},
  ]);

  server.auth.strategy(playlistAuthStrategy, 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.ext('onPreResponse', onPreResponseHandler);

  return server;
};

module.exports = configuredServer;
