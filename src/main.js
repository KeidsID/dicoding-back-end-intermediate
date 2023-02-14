require('dotenv').config();

const configuredServer = require('./configuredServer');

// "albums" endpoint envs
const albumsPlugin = require('./server/api/albums');
const AlbumsService = require('./server/services/AlbumsService');
const AlbumsValidator = require('./server/validators/albums');

// "authentications" endpoint envs
const authPlugin = require('./server/api/authentications');
const AuthenticationsService = require(
    './server/services/AuthenticationsService');
const AuthValidator = require('./server/validators/authentications');
const tokenManager = require('./server/tokenize/TokenManager');

// "collaborations" endpoint envs
const collabPlugin = require('./server/api/collaborations');
const CollaborationsService = require(
    './server/services/CollaborationsService');
const CollaborationsValidator = require('./server/validators/collaborations');

// "playlists" endpoint envs
const playlistsPlugin = require('./server/api/playlists');
const PlaylistsService = require('./server/services/PlaylistsService');
const PlaylistSongsService = require('./server/services/PlaylistSongsService');
const PlaylistsValidator = require('./server/validators/playlists');

// "songs" endpoint envs
const songsPlugin = require('./server/api/songs');
const SongsService = require('./server/services/SongsService');
const SongsValidator = require('./server/validators/songs');

// "userss" endpoint envs
const usersPlugin = require('./server/api/users');
const UsersService = require('./server/services/UsersService');
const UsersValidator = require('./server/validators/users');

const main = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(usersService);

  const songsService = new SongsService();
  const albumsService = new AlbumsService(songsService);

  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService(songsService);

  const server = await configuredServer();

  await server.register([
    {
      plugin: usersPlugin, options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authPlugin, options: {
        authenticationsService, usersService,
        tokenManager, validator: AuthValidator,
      },
    },
    {
      plugin: collabPlugin, options: {
        collaborationsService, playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: songsPlugin, options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albumsPlugin, options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: playlistsPlugin, options: {
        playlistsService, playlistSongsService,
        validator: PlaylistsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server runs at ${server.info.uri}`);
};

main();
