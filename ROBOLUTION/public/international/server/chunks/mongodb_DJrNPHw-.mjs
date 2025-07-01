import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "test";
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
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
async function getTemplate(templateId = "default") {
  const { db } = await connectToDatabase();
  const templates = db.collection("templates");
  let templateData = await templates.findOne({ Name: templateId });
  if (!templateData && templateId !== "default") {
    templateData = await templates.findOne({ Name: "default" });
  }
  return templateData;
}
async function getInternationalPartners() {
  const { db, client } = await connectToDatabase("robolution");
  const partnersCollection = db.collection("partners");
  const partners = await partnersCollection.find({ type: "international" }).toArray();
  return partners;
}

export { getInternationalPartners as a, getTemplate as g };
