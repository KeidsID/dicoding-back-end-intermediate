require('dotenv').config();

const configuredServer = require('./configuredServer');

// "albums" endpoint envs
const albumsPlugin = require('./server/api/albums');
const AlbumsService = require('./server/services/AlbumsService');
const AlbumsValidator = require('./server/validators/albums');

// "authentications" endpoint envs
const authPlugin = require('./server/api/authentications');
const AuthenticationsService =
require('./server/services/AuthenticationsService');
const AuthValidator = require('./server/validators/authentications');
const tokenManager = require('./server/tokenize/TokenManager');

// "songs" endpoint envs
const songsPlugin = require('./server/api/songs');
const SongsService = require('./server/services/SongsService');
const SongsValidator = require('./server/validators/songs');

// "userss" endpoint envs
const usersPlugin = require('./server/api/users');
const UsersService = require('./server/services/UsersService');
const UsersValidator = require('./server/validators/users');

const main = async () => {
  const albumsService = new AlbumsService();
  const authenticationsService = new AuthenticationsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = await configuredServer();

  await server.register([
    {
      plugin: albumsPlugin, options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: authPlugin, options: {
        authenticationsService, usersService,
        tokenManager, validator: AuthValidator,
      },
    },
    {
      plugin: songsPlugin, options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin, options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);


  await server.start();
  console.log(`Server runs at ${server.info.uri}`);
};

main();
