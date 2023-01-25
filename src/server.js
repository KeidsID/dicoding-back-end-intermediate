const albumsPlugin = require('./api/albums');
const {AlbumsService} = require('./services/AlbumsService');
const AlbumsValidator = require('./validators/albums');
const configuredServer = require('./configuredServer');
const songsPlugin = require('./api/songs');
const {SongsService} = require('./services/SongsService');
const SongsValidator = require('./validators/songs');

const runServer = async () => {
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

runServer();
