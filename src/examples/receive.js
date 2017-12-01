
import amqp from 'amqplib';

(async () => {
  const conn = await amqp.connect('amqp://guest:guest6@127.0.0.1:5672');
  const ch = await conn.createChannel();
  const q = 'mq-102';
  ch.assertQueue(q, { durable: true });
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q);
  ch.consume(q, (msg) => {
    console.log(' [x] Received %s', msg.content.toString());
  }, { noAck: true });
})();
