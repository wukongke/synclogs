import mqTools from './mqTools';
import systemparamsVO from '../models/systemparams';
import logLoop from './logLoop';
import mqLoop from './mqLoop';

// 更新消息数大于100的酒店HostId到systemparams表
async function upFullHostIds() {
  const mqFullHostIds = await mqTools.getMqFullHostIds();
  const sysUpdateParams = { mqFullHostIds };
  await systemparamsVO.findOneAndUpdate({ module: 'hotelboss' }, { $set: sysUpdateParams }, { upsert: true, new: true });
}

export default {
  async taskLoop() {
    try {
      await upFullHostIds();
      const tasks = [logLoop.task(), mqLoop.task()];
      await Promise.all(tasks);
    } catch (e) {
      console.log(`mq-work: ${e}`);
    }
  },
};
