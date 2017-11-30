import { Schema } from 'mongoose';
import mgo from '../common/mgo';

const disablevodgroupShema = new Schema({
  hostid: { type: Number, default: 0 },
  groupid: { type: Number, default: 0 },
  groupno: String,
  groupname: String,
  createtime: { type: Date, default: Date.now },
  vodenabletime: { type: Date },
  canceltime: { type: Date },
  status: { type: Number, default: 1 }, // 1：有效；2：删除
}, {
  timestamps: true,
  collection: 'disablevodgroup',
});

disablevodgroupShema.index({ hostid: 1, groupid: 1, status: 1, groupno: 1 });

module.exports = mgo.hotelDB.model('disablevodgroup', disablevodgroupShema);
