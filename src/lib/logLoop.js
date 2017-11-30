import _ from 'lodash';
import moment from 'moment';
import tools from '../common/tools';
import oplogVO from '../models/oplog';
import config from '../config/config';
import eventlogVO from '../models/eventlog';
import systemparamsVO from '../models/systemparams';
import syncpolicyVO from '../models/syncpolicy';
import mqTools from './mqTools';

function convert2DBEventLog(data) {
  return {
    ts: data.ts,
    op: data.op,
    ns: data.ns,
    o: data.o || {},
    o2: data.o2 || {},
    hostid: data.hostid || '',
  };
}
// 保存到事件日志表
const saveToEventLog = async (eventLogs) => {
  for (const item of eventLogs) {
    await eventlogVO.create(item);
  }
  return true;
};
// 发送到消息队列
const saveToMQ = async (logs) => {
  try {
    for (const log of logs) {
      await mqTools.send(log);
    }
  } catch (e) {
    console.log('saveToMQ: ', e);
  }
  return true;
};
// 判断日志是否符合规则
const isAllowHandle = (curPolicy, log) => {
  console.log('log: ', log);
  let res = true;
  if (log.o.$set && log.o.$set !== undefined) {
    log.o = { ...log.o.$set };
  }
  delete log.o.createdAt;
  delete log.o.updatedAt;
  delete log.o._id;
  delete log.o.__v;
  delete log.o.hostId;
  delete log.o.hostid;
  const logKeys = Object.keys(log.o);
  if (curPolicy.allowop.length > 0 && curPolicy.allowop.includes(log.op)) {
    if (log.op === 'u') {
      if (curPolicy.denyfield.length > 0) {
        curPolicy.denyfield.some((item) => {
          if (logKeys.includes(item)) {
            res = false;
            return true;
          }
          return false;
        });
        return res;
      }
      if (curPolicy.allowfield.length > 0 && !tools.isContained(curPolicy.allowfield, logKeys)) {
        res = false;
      }
    }
  } else {
    res = false;
  }
  return res;
};
// 日志数据格式处理
async function logHandle(oplogs, policys) {
  const newLogs = [];
  await Promise.all(oplogs.map(async (item) => {
    let curPolicy = {};
    policys.some((p) => {
      if (p.collectionname === item.ns) {
        curPolicy = p;
        return true;
      }
      return false;
    });
    console.log('item: ', item);
    if (isAllowHandle(curPolicy, _.cloneDeep(item))) {
      const mVO = require(`../models/${curPolicy.modelname}`);
      const mFilter = {};
      if (item.op === 'u') {
        mFilter._id = String(item.o2._id);
      } else {
        mFilter._id = String(item.o._id);
      }
      const moduleRow = await mVO.findOne(mFilter);
      if (moduleRow) {
        if (item.o.$set && item.o.$set !== undefined) {
          item.o = { ...item.o.$set };
        }
        if (item.op === 'i' || item.op === 'u') {
          item.o2 = {};
          item.o2[curPolicy.primarykey] = moduleRow[curPolicy.primarykey] || null;
        }
        if (curPolicy.createtime && curPolicy.createtime !== undefined) {
          item.o[curPolicy.createtime] = moment(item.o.createdAt).format('YYYY-MM-DD HH:mm:ss') || '';
        }
        if (curPolicy.updatetime && curPolicy.updatetime !== undefined) {
          item.o[curPolicy.updatetime] = moment(item.o.updatedAt).format('YYYY-MM-DD HH:mm:ss') || '';
        }
        delete item.o.createdAt;
        delete item.o.updatedAt;
        delete item.o._id;
        delete item.o.__v;
        delete item.o.hostId;
        delete item.o.hostid;
        console.log('moduleRow: ', moduleRow);
        item.hostid = moduleRow.hostid || moduleRow.hostId || '';
        console.log('item.hostid: ', item.hostid);
      }
      item.ns = curPolicy.table;
      item = convert2DBEventLog(item);
      newLogs.push(item);
    }
  }));
  return newLogs;
}
export default {
  async task() {
    try {
      console.log('logLoop start ......');
      const filter = { op: { $nin: ['n', 'd'] } };
      const sysParamsRow = await systemparamsVO.findOne({ module: 'hotelboss' });
      if (sysParamsRow && !_.isEmpty(sysParamsRow.lastSyncTime)) {
        filter.ts = { $gt: sysParamsRow.lastSyncTime };
      }
      const policys = await syncpolicyVO.find();
      const cols = [];
      policys.forEach((item) => { cols.push(item.collectionname); });
      if (cols && cols.length > 0) {
        filter.ns = { $in: cols };
      }
      console.log('log filter: ', filter);
      const oplogs = await oplogVO.find(filter).limit(config.loglimit);
      console.log('oplogs-len: ', oplogs.length);
      if (oplogs && oplogs.length > 0) {
        const newOplogs = await logHandle(oplogs, policys);
        const eventLogs = [];
        const mqLogs = [];
        newOplogs.forEach((item) => {
          if (item.o && !_.isEmpty(item.o)) {
            if (sysParamsRow.mqFullHostIds.indexOf(item.hostid) !== -1) {
              eventLogs.push(item);
            } else {
              mqLogs.push(item);
            }
          }
        });
        await Promise.all([saveToEventLog(eventLogs), saveToMQ(mqLogs)]);
        // 更新系统最后同步时间
        const sysUpdateParams = { lastSyncTime: oplogs[oplogs.length - 1].ts };
        await systemparamsVO.update({ module: 'hotelboss' }, { $set: sysUpdateParams }, { upsert: true });
      } else {
        await tools.sleep(1000 * 5); // 睡眠5秒钟
      }
    } catch (e) {
      console.log(`logLoop-err: ${JSON.stringify(e)}`);
    }
  },
};
