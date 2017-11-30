import { Schema } from 'mongoose';
import mgo from '../common/mgo';

const syncPolicySchema = new Schema({
  collectionname: { type: String, default: '' },
  modelname: { type: String, default: '' },
  allowop: { type: Array, default: [] },
  allowfield: { type: Array, default: [] },
  denyfield: { type: Array, default: [] },
  table: { type: String, default: '' },
  primarykey: { type: String, default: '' },
  createtime: { type: String, default: '' },
  updatetime: { type: String, defalt: '' },
}, {
  timestamps: true,
});

syncPolicySchema.index({ collectionname: 1 });

export default mgo.synclogDB.model('syncpolicy', syncPolicySchema, 'syncpolicy');

