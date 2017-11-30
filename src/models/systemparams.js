import { Schema } from 'mongoose';
// import moment from 'moment';
import mgo from '../common/mgo';

const systemParamSchema = new Schema({
  module: { type: String, default: '' },
  lastSyncTime: { type: Object, default: {} },
  // lastSyncTime: {
  //   _bsontype: { type: String, default: '' },
  //   low_: { type: Number, default: 1 },
  //   high_: { type: Number, default: moment().format('X') },
  // },
  mqFullHostIds: { type: Array, default: [] },
}, {
  timestamps: true,
});

export default mgo.synclogDB.model('systemparam', systemParamSchema, 'systemparam');

