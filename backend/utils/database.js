import { MongoClient } from "mongodb";

import { defaults, resources } from "../data/defaultData.js";

let clientPromise;
let database;

function getMongoUri() {
  return process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
}

function getDatabaseName() {
  return process.env.MONGODB_DB_NAME || "webdatsan";
}

function createClient() {
  return new MongoClient(getMongoUri());
}

async function ensureIndexes(db) {
  await Promise.all(
    resources.map(async (resource) => {
      await db.collection(resource).createIndex({ id: 1 }, { unique: true });
    }),
  );
}

async function seedCollection(db, resource) {
  const collection = db.collection(resource);
  const seedData = defaults[resource] || [];

  for (const item of seedData) {
    await collection.updateOne(
      { id: item.id },
      { $setOnInsert: item },
      { upsert: true },
    );
  }
}

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  if (!clientPromise) {
    const client = createClient();
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  database = client.db(getDatabaseName());

  await ensureIndexes(database);
  await Promise.all(resources.map((resource) => seedCollection(database, resource)));

  return database;
}

export function getDatabase() {
  if (!database) {
    throw new Error("MongoDB is not connected. Call connectToDatabase() before using the store.");
  }

  return database;
}

export function getCollection(resource) {
  return getDatabase().collection(resource);
}
