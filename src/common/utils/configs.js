/**
 * List of configs from environment vars.
 */
const configs = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    accessKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    refreshKey: process.env.REFRESH_TOKEN_KEY,
  },
  mq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = configs;
