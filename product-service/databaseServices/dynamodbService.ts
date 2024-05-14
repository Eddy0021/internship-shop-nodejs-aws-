// dynamodbService.ts
import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
require('dotenv').config();

const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });

export const getProductById = async (productId: string) => {
  const productParams = {
    TableName: process.env.PRODUCTS_TABLE || '',
    Key: { id: { S: productId } }
  };

  const stockParams = {
    TableName: process.env.STOCK_TABLE || '', // Assuming you have a STOCK_TABLE environment variable
    KeyConditionExpression: 'product_id = :pid',
    ExpressionAttributeValues: {
      ':pid': { S: productId }
    }
  };

  const [productResponse, stockResponse] = await Promise.all([
    dynamodb.send(new GetItemCommand(productParams)),
    dynamodb.send(new QueryCommand(stockParams))
  ]);

  const productItem = productResponse.Item ? unmarshall(productResponse.Item) : null;
  const stockItems = stockResponse.Items || [];
  const totalStock = stockItems.reduce((acc, item) => acc + (item.count ? parseInt(item.count.N || '0') : 0), 0);

  if (productItem) {
    return {
      id: productItem.id,
      title: productItem.title,
      description: productItem.description,
      price: productItem.price,
      count: totalStock ? totalStock : 0
    };
  } else {
    return null;
  }
};

export const getAllProducts = async () => {
  const productParams = {
    TableName: process.env.PRODUCTS_TABLE || '',
  };

  const productResponse = await dynamodb.send(new ScanCommand(productParams));
  const productItems = productResponse.Items || [];

  const productsWithStock = await Promise.all(productItems.map(async (item) => {
    const productId = item.id.S || '';
    const stockParams = {
      TableName: process.env.STOCK_TABLE || '',
      KeyConditionExpression: 'product_id = :pid',
      ExpressionAttributeValues: {
        ':pid': { S: productId }
      }
    };

    const stockResponse = await dynamodb.send(new QueryCommand(stockParams));
    const stockItems = stockResponse.Items || [];
    const totalStock = stockItems.reduce((acc, item) => acc + (item.count ? parseInt(item.count.N || '0') : 0), 0);

    return {
      id: item.id.S,
      title: item.title.S,
      description: item.description.S,
      price: item.price.N,
      count: totalStock ? totalStock : 0
    };
  }));

  return productsWithStock;
};

export const createProduct = async (productId: string, productData: any): Promise<void> => {
  const item = marshall({
    id: productId,
    title: productData.title,
    description: productData.description,
    price: productData.price
  });

  const params = {
    TableName: process.env.PRODUCTS_TABLE || '',
    Item: item
  };

  await dynamodb.send(new PutItemCommand(params));
};
