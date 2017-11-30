import { Schema } from 'mongoose';
import mgo from '../common/mgo';

const terminalsShema = new Schema({
  terminalid: { type: Number, unique: true },
  mcid: { type: String, default: '' },
  terminalipaddress: String,
  macaddress: String,
  roomid: { type: Number, default: 0 }, // 0：末使用 !0：已使用
  terminaltype: Number, // 0: 机顶盒 1: 广告机
  softwareversion: String,
  hardwareversion: String,
  kernelversion: String,
  terminalkey: String,
  cacardno: String,
  isonline: { type: Number, default: 0 }, // 0：离线 1：在线
  rcuipaddress: String,
  noisesensitivity: { type: Number, default: 32 },
  description: String,

  tag: String,
  lasthbtime: String, // 最后心跳时间
  hostid: { type: Number, default: 0 },

  terminalsessionkey: String,
  portalaccesscode: String,
  dvbautosearchflag: { type: Number, default: 0 },
  infogroupid: Number,
}, {
  timestamps: true,
});

terminalsShema.index({ hostid: 1, mcid: 1, isonline: 1, terminaltype: 1, terminalipaddress: 1 });
module.exports = mgo.hotelDB.model('terminals', terminalsShema);

