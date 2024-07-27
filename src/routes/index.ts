import { Router, Request, Response } from 'express';
import { S3Client, ListBucketsCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

const router = Router();
const client = new S3Client({ region: "us-east-1" });

router.get('/', async (req: Request, res: Response) => {
  const bucket = (typeof req.query.bucket === "string") ? req.query.bucket : "";

  if (bucket) {
    const command = new ListObjectsCommand({ Bucket: bucket });
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
  }
  else {
    res.send("pass a bucket param to test connectivity")
  }

});

export default router;
