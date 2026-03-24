import { randomUUID } from "crypto";

import { getCollection } from "./database.js";

function nowIso() {
  return new Date().toISOString();
}

function sanitize(document) {
  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;
  return rest;
}

export async function list(resource) {
  const collection = getCollection(resource);
  const documents = await collection.find({}, { projection: { _id: 0 } }).toArray();
  return documents;
}

export async function findById(resource, id) {
  if (!id) {
    return null;
  }

  const collection = getCollection(resource);
  const document = await collection.findOne(
    { id: String(id) },
    { projection: { _id: 0 } },
  );

  return sanitize(document);
}

export async function insert(resource, payload) {
  const collection = getCollection(resource);
  const item = {
    id: payload.id || randomUUID(),
    createdAt: payload.createdAt || nowIso(),
    ...payload,
  };

  await collection.insertOne({ ...item });
  return item;
}

export async function updateById(resource, id, patch) {
  if (!id) {
    return null;
  }

  const collection = getCollection(resource);
  const result = await collection.updateOne(
    { id: String(id) },
    { $set: { ...patch, updatedAt: nowIso() } },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return findById(resource, id);
}

export async function removeById(resource, id) {
  if (!id) {
    return null;
  }

  const existing = await findById(resource, id);
  if (!existing) {
    return null;
  }

  const collection = getCollection(resource);
  await collection.deleteOne({ id: String(id) });

  return existing;
}
