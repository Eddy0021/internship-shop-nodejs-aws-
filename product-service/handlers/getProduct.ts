'use strict';

import { handleResponse } from '../utils/handleResponse';
import { getProductById } from '../databaseServices/dynamodbService';

export const getProductHandler = async (event: any) => {
  try {
    const { productId } = event.pathParameters || {};

    // Get product details from DynamoDB
    const product = await getProductById(productId);

    if (!product) return handleResponse(404, 'Product not found.');

    return handleResponse(200, JSON.stringify(product));
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, error.message || 'Internal server error');
  }
};