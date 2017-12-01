
export default {
  loglimit: 10,
  mqPrefix: 'ihos-dbrow-',
  mqServer: {
    vhosts: 'ihos-dbrow',
    port: '5672',
    apiPort: '15672',
    username: 'guest',
    password: 'he123456',
    maxMsgLen: 100,
  },
};