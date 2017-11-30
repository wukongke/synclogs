import http from 'http';
import './env';
import './common/mgo';
import './initDB';
import mq from './common/mq';
import task from './lib/task';
// import sysVO from './models/systemparams';

// aliyun心跳检测
http.createServer((req, res) => {
  req.setTimeout(2 * 60 * 1000);
  res.end('');
}).listen(process.env.PORT || 3000);

// (async () => {
//   const res = await sysVO.findOne();
//   console.log(typeof res.lastSyncTime, res.lastSyncTime._bsontype, res.lastSyncTime.low_, res.lastSyncTime.high_);
// })();

/* eslint-disable */
(async () => {
  try {
    // await task.taskLoop();
    while (true) {
      await mq.setUp();
      await task.taskLoop();
    }
  } catch(e) {
    console.log(`mq-work-err: ${JSON.stringify(e)}`);
  }
})();
/* eslint-enable */
