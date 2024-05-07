'use strict';

import products from '../data/products.json';
import { handleError } from '../utils/handleError';

export async function getProduct (event) {
  try {
    const { productId } = event.pathParameters;
    const product = products.find((item) => item.id === productId);

    if(!product) return handleError(404, "Product not found." );

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.error('Error:', error);
    return handleError(500, 'Internal server error');
  }
};
