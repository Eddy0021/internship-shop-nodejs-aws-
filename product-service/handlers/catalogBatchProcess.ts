'use strict';

import { handleResponse } from '../utils/handleResponse';
import { createProductHandler } from './createProduct';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

// Initialize the SNS client
const snsClient = new SNSClient({ region: process.env.REGION });

export const catalogBatchProcessHandler = async (event: any) => {
  try {
    // Parse SQS event body
    const messageBody: any = [].concat(...event.Records.map(record => JSON.parse(record.body)));

    //console.log(messageBody);

    // Loop through each message
    for (const data of messageBody) {
        // Invoke createProductHandler for each message
        await createProductHandler({
            body: JSON.stringify(data)
        });
    }

    // Publish message to SNS topic
    await snsClient.send(new PublishCommand({
      TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:MyCustomTopic`,
      Message: 'New products have been created', 
    }));

    return handleResponse(200, 'Processed successfully');
  } catch (error) {
    console.error('Error processing SQS messages:', error);
    return handleResponse(500, 'Error processing SQS messages');
  }
};
