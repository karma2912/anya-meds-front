// lib/mongodb.ts

import { MongoClient, Db } from 'mongodb';

// Ensure the MONGODB_URI is set in your environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!dbName) {
    throw new Error('Please define the DATABASE_NAME environment variable inside .env.local');
}

// Create a cached connection variable
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Establishes a connection to the MongoDB database.
 * It uses a cached connection to improve performance in a serverless environment.
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
