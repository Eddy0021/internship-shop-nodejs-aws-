'use strict';

import { handleResponse } from '../utils/handleResponse';

module.exports.basicAuthorizerHandler = async (event) => {
  try {
    //console.log('Event:', event);

    if (!event.headers || !event.headers.authorization) {
      console.error('Error: Unauthorized');
      return handleResponse(401, 'Unauthorized')
    }

    const authHeader = event.headers.authorization;
    const encodedCredentials = authHeader.split(' ')[1];
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const credentials = buffer.toString('utf-8');

    const response = {
      isAuthorized: credentials.split(':')[1] === process.env.Eddy0021
    }

    console.log('Response', JSON.stringify(response));

    return response;
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, error)
  }
};
