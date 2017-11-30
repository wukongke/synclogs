// import moment from 'moment';
import syncPolicyVO from './models/syncpolicy';
import systemparamsVO from './models/systemparams';

const policys = [
  // {
  //   collectionname: 'db.disablevodgroup',
  //   modelname: 'disablevodgroup',
  //   allowop: ['i', 'u', 'd'], // 允许的操作，如增、删、改
  //   allowfield: [], // 更新时，允许修改的字段
  //   denyfield: [], // 更新时，禁止修改的字段
  //   table: 'db.disablevodgroup', // 酒店端对应的表名,如sdb20.room
  //   primarykey: 'groupid', // 酒店端主键字段 ，如room表的roomid
  //   ceratetime: 'createDate',
  //   updatetime: 'updateDate',
  // },
];
const sysParams = [
  // {
  //   module: 'hotelboss',
  //   lastSyncTime: { _bsontype: 'Timestamp', low_: 1, high_: parseInt(moment().add(7, 'days').format('X'), 10) },
  // },
];
console.log(sysParams);
async function initSyncPolicyParams() {
  if (policys.length > 0) {
    await Promise.all(policys.map(async (item) => {
      await syncPolicyVO.findOneAndUpdate({ collectionname: item.collectionname }, { $set: item }, { upsert: true, new: true });
    }));
  }
}
async function initSystemParams() {
  if (sysParams.length > 0) {
    try {
      await Promise.all(sysParams.map(async (item) => {
        console.log('item: ', item);
        const sysRes = await systemparamsVO.findOne({ module: item.module });
        if (!sysRes) {
          await systemparamsVO.create(item);
        }
      }));
    } catch (e) {
      console.log('initSystem: ', e);
    }
  }
}

(async () => {
  try {
    const initDBs = [initSyncPolicyParams(), initSystemParams()];
    await Promise.all(initDBs);
  } catch (e) {
    console.log(`initDB: ${e}`);
  }
})();
