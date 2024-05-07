'use strict';

import products from '../data/products.json';
import { handleError } from '../utils/handleError';

export async function getProducts (event) {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error:', error);
    return handleError(500, 'Internal server error');
  }
};
