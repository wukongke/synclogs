import { Schema } from 'mongoose';
import mgo from '../common/mgo';

const eventLogSchema = new Schema({
  ts: { type: Object, default: {} },
  op: { type: String, default: '' },
  ns: { type: String, default: '' },
  o: { type: Object, default: {} },
  o2: { type: Object, default: {} },
  hostid: { type: String, default: '' },
}, {
  timestamps: true,
});

eventLogSchema.index({ hostid: 1 });

export default mgo.synclogDB.model('eventlog', eventLogSchema, 'eventlog');

