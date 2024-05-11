import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const products = require('../data/products.json');

products.forEach(element => {
    element.id = uuidv4();
});

// Create DynamoDB DocumentClient
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });

// Function to insert product into products table
async function insertProduct(product) {
  const params = {
    TableName: 'products',
    Item: product
  };
  try {
    await dynamodb.put(params).promise();
    console.log(`Product ${product.id} inserted successfully`);
  } catch (error) {
    console.error('Unable to insert product. Error JSON:', JSON.stringify(error, null, 2));
  }
}

// Function to insert stock into stock table
async function insertStock(stock) {
  const params = {
    TableName: 'stock',
    Item: stock
  };
  try {
    await dynamodb.put(params).promise();
    console.log(`Stock for product ${stock.product_id} inserted successfully`);
  } catch (error) {
    console.error('Unable to insert stock. Error JSON:', JSON.stringify(error, null, 2));
  }
}


const stock = [
  {
    product_id: products[0].id,
    count: 1
  },
  {
    product_id: products[1].id,
    count: 2
  },
  {
    product_id: products[2].id,
    count: 3
  },
  {
    product_id: products[3].id,
    count: 4
  },
  {
    product_id: products[4].id,
    count: 5
  }
];

// Insert sample data
async function fillTables() {
  for (const product of products) {
    await insertProduct(product);
  }
  for (const s of stock) {
    await insertStock(s);
  }
}

// Execute
fillTables();
