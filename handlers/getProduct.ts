'use strict';

import products from '../data/products.json';
import { handleResponse } from '../utils/handleResponse';

export async function getProduct (event) {
  try {
    const { productId } = event.pathParameters;
    const product = products.find((item) => item.id === productId);

    if(!product) return handleResponse(404, "Product not found." );

    return handleResponse(200, JSON.stringify(product))
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, 'Internal server error');
  }
};
