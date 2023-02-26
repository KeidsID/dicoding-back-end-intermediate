const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const configs = require('../../common/utils/configs');
const {userIdAuthStrategy} = require('../../common/constants');
const onPreResponseHandler = require('./onPreResponseHandler');

const configuredServer = async () => {
  const server = Hapi.server({
    host: configs.server.host,
    port: configs.server.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {plugin: Jwt},
    {plugin: Inert},
  ]);

  server.auth.strategy(userIdAuthStrategy, 'jwt', {
    keys: configs.jwt.accessKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: configs.jwt.accessTokenAge,
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
