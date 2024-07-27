import { Router, Request, Response } from 'express';
import { S3Client, ListBucketsCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

const router = Router();
const client = new S3Client({ region: "us-east-1" });

router.get('/', async (req: Request, res: Response) => {
  const command = new ListObjectsCommand({ Bucket: 'ccitmpsom'});
  let baseData = JSON.stringify(process.env) + "\n"
  try {
    const data = await client.send(command);
    res.send(baseData + JSON.stringify(data))
    // process data.
  } catch (error) {
    res.send(baseData + JSON.stringify(error))
    // error handling.
  } finally {
    // finally.
  }

});

export default router;
