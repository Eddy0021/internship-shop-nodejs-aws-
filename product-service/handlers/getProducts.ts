'use strict';

import { handleResponse } from '../utils/handleResponse';
import { getAllProducts } from '../databaseServices/dynamodbService';

export const getProductsHandler = async () => {
  try {
    // Get all products from DynamoDB
    const products = await getAllProducts();

    if (!products.length) return handleResponse(404, 'No products found.');

    return handleResponse(200, JSON.stringify(products));
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, error.message || 'Internal server error');
  }
};