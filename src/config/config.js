
const logLimit = 10;

const mqPrefix = 'ihos-dbrow-';

const mqServer = {
  vhosts: 'ihos-dbrow',
  port: '5672',
  apiPort: '15672',
  username: 'ihos-dbrow',
  password: 'ihos-dbrow',
  maxMsgLen: 100,
};

module.exports = {
  logLimit,
  mqPrefix,
  mqServer,
};
