'use strict';

import { createProduct } from '../databaseServices/dynamodbService';
import { handleResponse } from '../utils/handleResponse';
import { v4 as uuidv4 } from 'uuid';

export const createProductHandler = async (event: any) => {
  try {
    // Parse the request body to extract product data
    const productData = JSON.parse(event.body || '');

    // Generate a unique ID for the new product
    const productId = uuidv4();

    // Create the new product using the createProduct function from dynamodbService
    await createProduct(productId, productData);

    // Return a success response with the newly created product ID
    return handleResponse(200, JSON.stringify(productId));
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, error);
  }
};
