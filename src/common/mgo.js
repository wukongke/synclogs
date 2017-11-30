import mongoose from 'mongoose';
import { bunyan } from 'koa-bunyan-logger';

const logger = bunyan.createLogger({
  name: 'mongodb',
  level: process.env.LOG_LEVEL,
});
mongoose.Promise = Promise;
const oplogDB = mongoose.createConnection(process.env.OPLOG_MONGO_DB);
oplogDB.once('open', logger.info.bind(logger, 'oplogDB connected'));
oplogDB.on('error', logger.error.bind(logger));

const synclogDB = mongoose.createConnection(process.env.SYNC_LOG_MONGO_DB);
synclogDB.once('open', logger.info.bind(logger, 'synclogDB connected'));
synclogDB.on('error', logger.error.bind(logger));

const hotelDB = mongoose.createConnection(process.env.HOTEL_MONGO_DB);
hotelDB.once('open', logger.info.bind(logger, 'hotelDB connected'));
hotelDB.on('error', logger.error.bind(logger));

export default {
  oplogDB,
  synclogDB,
  hotelDB,
};
