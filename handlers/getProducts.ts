'use strict';

import products from '../data/products.json';
import { handleResponse } from '../utils/handleResponse';

export async function getProducts (event) {
  try {
    return handleResponse(200, JSON.stringify(products));
  } catch (error) {
    console.error('Error:', error);
    return handleResponse(500, 'Internal server error');
  }
};
