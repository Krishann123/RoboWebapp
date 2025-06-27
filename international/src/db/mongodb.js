import { MongoClient } from 'mongodb';

const MONGODB_URI = import.meta.env.MONGODB_URI;
const DB_NAME = 'test';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase(dbName = DB_NAME) {
  if (cachedClient && cachedDb && dbName === DB_NAME) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(dbName);

  if (dbName === DB_NAME) {
    cachedClient = client;
    cachedDb = db;
  }

  return { client, db };
}

export async function getTemplate(templateId = 'default') {
  const { db } = await connectToDatabase();
  const templates = db.collection('templates');
  
  let templateData = await templates.findOne({ Name: templateId });
  
  if (!templateData && templateId !== 'default') {
    templateData = await templates.findOne({ Name: 'default' });
  }
  
  return templateData;
}

export async function getInternationalPartners() {
  const { db, client } = await connectToDatabase('robolution');
  const partnersCollection = db.collection('partners');
  const partners = await partnersCollection.find({ type: 'international' }).toArray();
  // client.close(); // Not closing client to allow connection reuse. The cachedClient logic should handle this.
  return partners;
}

export async function getPageContent(templateId = 'default', pageName) {
  const template = await getTemplate(templateId);
  const pageContent = template?.config?.Contents?.[pageName];

  if (!pageContent || Object.keys(pageContent).length === 0) {
    // Fallback to default template's content for that page if it exists
    const defaultTemplate = await getTemplate('default');
    return defaultTemplate?.config?.Contents?.[pageName] || null;
  }
  return pageContent;
} 