
export default {
  loglimit: 10, // 每次拉取任务数量
  mqPrefix: 'ihos-dbrow-',
  mqServer: {
    vhosts: 'ihos-dbrow',
    port: '5672',
    apiPort: '15672',
    username: 'ihos-dbrow',
    password: 'ihos-dbrow',
    maxMsgLen: 100, // 队列最大消息数
  },
};