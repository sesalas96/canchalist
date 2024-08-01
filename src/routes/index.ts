import { Router, Request, Response } from 'express';
import { Kafka } from 'kafkajs';
const {
  createMechanism
} = require('@jm18457/kafkajs-msk-iam-authentication-mechanism')


const router = Router();

let kafka =new Kafka({
  clientId: 'test-app',
  brokers: ['b-1.ccikafkadev.blxpf3.c21.kafka.us-east-1.amazonaws.com:9098','b-2.ccikafkadev.blxpf3.c21.kafka.us-east-1.amazonaws.com:9098','b-3.ccikafkadev.blxpf3.c21.kafka.us-east-1.amazonaws.com:9098'],
  // authenticationTimeout: 10000,
  // reauthenticationThreshold: 10000,
  ssl: true,
  sasl: createMechanism({ region: 'us-east-1' })/*{
      mechanism: 'aws',
      authorizationIdentity: 'AIDAIOSFODNN7EXAMPLE', // UserId or RoleId
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      sessionToken: 'WHArYt8i5vfQUrIU5ZbMLCbjcAiv/Eww6eL9tgQMJp6QFNEXAMPLETOKEN' // Optional
    },*/
})

let isConsuming = false;



router.get('/', async (req: Request, res: Response) => {
  // check msk topcs

  if (!isConsuming) {
    isConsuming = true
    const consumer = kafka.consumer({ groupId: 'testgroup' })
    await consumer.subscribe({ topics: ['on-test'] })
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {

        console.log({
          // @ts-ignore
          key: message.key.toString(),
          // @ts-ignore
          value: message.value.toString(),
          headers: message.headers,
        })
      },
    })
    res.send("started listening")
  }
  else {
    res.send("already listening")
  }

  /*const params = {
  };
  const command = new ListClustersCommand(params);
  try {
    const data = await client.send(command);
    res.send(JSON.stringify(data))
    // process data.
  } catch (error) {
    // error handling.
    res.send(JSON.stringify(error));
  } finally {
    // finally.
  }*/

});

export default router;
