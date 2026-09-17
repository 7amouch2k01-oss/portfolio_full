import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local or Vercel settings.');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 8000,
};

let client;
let clientPromise;

// In development, reuse the connection across hot-reloads to avoid exhausting connections
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (Vercel), create a new client per module load
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get the contacts collection
export async function getContactsCollection() {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection('contacts');
}
