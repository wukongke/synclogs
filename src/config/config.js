
export default {
  loglimit: 10,
  mqPrefix: 'ihos-dbrow-',
  mqServer: {
    vhosts: 'ihos-dbrow',
    port: '5672',
    apiPort: '15672',
    username: 'ihos-dbrow',
    password: 'ihos-dbrow',
    maxMsgLen: 100,
  },
};