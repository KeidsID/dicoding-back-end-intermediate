const redis = require('redis');

const configs = require('../../../common/utils/configs');

/**
 * Cache Service using Redis.
 */
class CacheService {
  #client;

  /**
   */
  constructor() {
    this.#client = redis.createClient({
      socket: {
        host: configs.redis.host,
      },
    });

    this.#client.on('error', (e) => {
      console.error(e);
    });

    this.#client.connect();
  }

  /**
   * Set value into memory as cache.
   *
   * @param {string} key - Cache identifier for `get()`
   * @param {string} value
   * @param {number} expirationInSecond
   */
  async set(key, value, expirationInSecond = 3600) {
    await this.#client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * Get data from cache.
   *
   * Return null value if cache not found.
   *
   * @param {string} key
   *
   * @return {Promise<string | null>}
   */
  async get(key) {
    return await this.#client.get(key);
  }

  /**
   * Delete cache from memory.
   *
   * Provide an array of keys to delete more than one caches.
   *
   * @param {string | string[]} keys
   */
  async del(keys) {
    await this.#client.del(keys);
  }
}

module.exports = CacheService;
