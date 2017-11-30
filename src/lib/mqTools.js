import axios from 'axios';
import mq from '../common/mq';
import config from '../config/config';

function convert2Msg(data) {
  return {
    op: data.op,
    ns: data.ns,
    o: data.o || {},
    o2: data.o2 || {},
  };
}
export default {
  async send(data) {
    try {
      if (!data.hostid) {
        return;
      }
      const q = `${config.mqPrefix}${data.hostid}`;
      await mq.assertQueue(q, { durable: true });
      const msg = JSON.stringify(convert2Msg(data));
      await mq.sendToQueue(q, msg);
    } catch (e) {
      console.log(`mq-send-err: ${JSON.stringify(e)}`);
    }
  },
  // 获取消息数大于100的酒店HostId
  async getMqFullHostIds() {
    const mqApiUrl = `http://${process.env.MQ_SERVER_IP}:${config.mqServer.apiPort}/api/queues`;
    const result = await axios.get(mqApiUrl, { auth: { username: config.mqServer.username, password: config.mqServer.password }, timeout: 1000 * 30 });
    const res = result.data || [];
    const mqFullHostIds = [];
    if (res && res.length > 0) {
      res.map((item) => {
        const maxMsgLen = config.mqServer.maxMsgLen || 100;
        if (item.messages > maxMsgLen) {
          const hostid = item.name.split('-')[2] || '';
          if (hostid) {
            mqFullHostIds.push(hostid);
          }
        }
        return true;
      });
    }
    return mqFullHostIds;
  },
};

