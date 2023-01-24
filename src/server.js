const AlbumsService = require('./services/AlbumsService');
const albumsPlugin = require('./api/albums');
const configuredServer = require('./configuredServer');

const runServer = async () => {
  const albumsService = new AlbumsService();

  const server = configuredServer();

  await server.register({
    plugin: albumsPlugin,
    options: {
      service: albumsService,
    },
  });


  await server.start();
  console.log(`Server runs at ${server.info.uri}`);
};

runServer();
