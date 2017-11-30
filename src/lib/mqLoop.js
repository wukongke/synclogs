import config from '../config/config';
import tools from '../common/tools';
import eventlogVO from '../models/eventlog';
import systemparamsVO from '../models/systemparams';
import mqTools from './mqTools';

export default {
  async task() {
    try {
      console.log('mqLoop start ......');
      const filter = {};
      const sysParamsRow = await systemparamsVO.findOne({ module: 'hotelboss' });
      if (sysParamsRow && sysParamsRow.mqFullHostIds.length > 0) {
        filter.hostid = { $nin: sysParamsRow.mqFullHostIds };
      }
      console.log('mq filter: ', filter);
      const logs = await eventlogVO.find(filter).limit(config.logLimit);
      if (logs && logs.length > 0) {
        for (const log of logs) {
          await mqTools.send(log);
          await eventlogVO.remove({ _id: log._id });
        }
      } else {
        await tools.sleep(1000 * 5); // 睡眠5秒钟
      }
    } catch (e) {
      console.log(`mqLoop-err: ${JSON.stringify(e)}`);
    }
  },
};
