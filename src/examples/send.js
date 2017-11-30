import mq from '../common/mq';

(async () => {
  try {
    await mq.setUp();
    const hosts = ['101', '102', '103'];
    await Promise.all(hosts.map(async (item) => {
      const q = `mq-${item}`;
      await mq.assertQueue(q, { durable: true });
      const msg = JSON.stringify({ hostId: '101', roomNo: '2002' });
      await mq.sendToQueue(q, msg);
      console.log(`{item} Sent ${msg} => q`);
    }));
  } catch (e) {
    console.log(`mq-send-err: ${JSON.stringify(e)}`);
  }
})();
