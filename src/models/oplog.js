import { Schema } from 'mongoose';
import mgo from '../common/mgo';

const oplogSchema = new Schema({
  ts: { type: Object, default: {} },
  op: { type: String, default: '' },
  ns: { type: String, default: '' },
  o: { type: Object, default: {} },
  o2: { type: Object, default: {} },
});

export default mgo.oplogDB.model('oplog.rs', oplogSchema, 'oplog.rs');

