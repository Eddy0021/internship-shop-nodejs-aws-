'use strict';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
const csvParser = require('csv-parser');

import { handleResponse } from '../utils/handleResponse';

const s3Client = new S3Client();
const sqsClient = new SQSClient();
const sqsQueueUrl = process.env.SQSQUEUEURL;

module.exports.importFileParserHandler = async (event) => {
  const records: any = [];

  // Iterate through S3 event records
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    // Check if the object is in the uploaded folder
    if (!key.startsWith('uploaded/')) {
      continue;
    }

    // Get the object from S3
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
    };

    try {
      // Call getObject method and await the response
      const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

      if (!Body) {
        console.error('Object body is empty:', key);
        continue;
      }

      // Create a readable stream from the object body
      const s3Stream = Readable.from(Body as Readable);

      // Parse CSV using csv-parser
      const parserStream = s3Stream.pipe(csvParser());

      // Log each record to CloudWatch and add to records array
      parserStream.on('data', (data) => {
        data.price = parseInt(data.price);
        //console.log('Parsed record:', data);
        records.push(data);
      });

      // Handle any errors during parsing
      parserStream.on('error', (error) => {
        console.error('Error parsing CSV:', error);
      });

      // Wait for the stream to finish
      await new Promise((resolve, reject) => {
        parserStream.on('end', resolve);
        parserStream.on('error', reject);
      });
    } catch (error) {
      console.error('Error fetching object from S3:', error);
    }
  }

  try {
    // Send the accumulated records as a batch to SQS
    const params = {
      QueueUrl: sqsQueueUrl,
      MessageBody: JSON.stringify(records)
    };

    await sqsClient.send(new SendMessageCommand(params));
    console.log('Records sent to SQS successfully.');
  } catch (error) {
    console.error('Error sending records to SQS:', error);
  }

  return handleResponse(200, JSON.stringify({ records }));
};