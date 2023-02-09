require('dotenv').config();

const configuredServer = require('./configuredServer');

const albumsPlugin = require('./server/api/albums');
const AlbumsService = require('./server/services/AlbumsService');
const AlbumsValidator = require('./server/validators/albums');

const songsPlugin = require('./server/api/songs');
const SongsService = require('./server/services/SongsService');
const SongsValidator = require('./server/validators/songs');

const main = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = configuredServer();

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);


  await server.start();
  console.log(`Server runs at ${server.info.uri}`);
};

main();
