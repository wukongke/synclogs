import _ from 'lodash';
import amqp from 'amqplib';
import config from '../config/config';

let conn = {};
let ch = {};

// 创建连接和channel
const setUp = async () => {
  if (_.isEmpty(conn) && _.isEmpty(ch)) {
    const mqUrl = `amqp://${config.mqServer.username}:${config.mqServer.password}@${process.env.MQ_SERVER_IP}:${config.mqServer.port}/${config.mqServer.vhosts}`;
    conn = await amqp.connect(mqUrl);
    ch = await conn.createChannel();
    console.log('mq setUp ---------');
  }
};
const assertQueue = async (q, option) => {
  await ch.assertQueue(q, option);
};
const sendToQueue = async (q, msg) => {
  await ch.sendToQueue(q, new Buffer(msg));
};

export default {
  async setUp() {
    await setUp();
  },
  async assertQueue(q, option) {
    console.log(`mq: ${q}`);
    try {
      await assertQueue(q, option);
    } catch (e) {
      console.log(`assertQueue: ${JSON.stringify(e)}`);
    }
  },
  async sendToQueue(q, msg) {
    console.log(`Sent ${msg} => ${q}`);
    try {
      await sendToQueue(q, msg);
    } catch (e) {
      console.log(`sendToQueue: ${JSON.stringify(e)}`);
    }
  },
};
