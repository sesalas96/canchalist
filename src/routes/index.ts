import { Router, Request, Response } from 'express';
import { S3Client, ListBucketsCommand, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import {Client} from "pg";
import { Signer } from '@aws-sdk/rds-signer'



const router = Router();
const client = new S3Client({ region: "us-east-1" });

router.get('/', async (req: Request, res: Response) => {
  res.send("Hello world!")


});

router.get('/dbTest', async (req: Request, res: Response) => {
  let signer = new Signer({
    region: 'us-east-1',
    hostname: 'cci-web-dev.cdytq7ggxjhh.us-east-1.rds.amazonaws.com',
    port: 5432,
    username: 'ordernegotiation'
  });


  const token = await signer.getAuthToken();
  console.log("t", token)
  const pgClient = new Client({
    user: 'ordernegotiation',
    password: token,
    host: 'cci-web-dev.cdytq7ggxjhh.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'ordernegotiation',
    ssl: {
      rejectUnauthorized: false
    }
  })
  await pgClient.connect()
  let dbres = await pgClient.query("SELECT * from testtable")
  console.log(dbres)
  res.send(JSON.stringify(dbres))

});

router.get('/kafkaTest', async (req: Request, res: Response) => {
  res.send("Not implemented")

});

router.get('/s3test', async (req: Request, res: Response) => {
  const bucket = (typeof req.query.bucket === "string") ? req.query.bucket : "";

  if (bucket) {
    let key = Math.random() * 1000000;


    const input = {
      "Body": "HappyFace.jpg",
      "Bucket": "ccitmpsom",
      "Key": "test" + key + ".txt"
    };

    const command = new ListObjectsCommand({ Bucket: bucket });
    let baseData = JSON.stringify(process.env) + "\n"
    try {
      const data = await client.send(command);
      const writeCommand = new PutObjectCommand(input)
      await client.send(writeCommand);
      res.send(baseData + JSON.stringify(data))
      // process data.
    } catch (error) {
      res.send(baseData + JSON.stringify(error))
      // error handling.
    } finally {
      // finally.
    }
  }
  else {
    res.send("pass a bucket param to test connectivity")
  }

});

export default router;
