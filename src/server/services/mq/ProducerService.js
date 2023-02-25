const amqplib = require('amqplib');

const configs = require('../../../common/utils/configs');

/**
 * MQ Service for Producing Queue.
 */
const ProducerService = {
  /**
   * Send message to queue.
   *
   * @param {string} queue
   * @param {*} msg
   */
  sendMsg: async (queue, msg) => {
    const connection = await amqplib.connect(configs.mq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
