const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

let db, uri, dbID;

async function init() {
  if (!db) await connect();
}

function setConfig(config) {
  uri = config[0];
  dbID = config[1];
}

function getDatabaseID() {
  return dbID;
}

async function connect() {
  db = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });
}

function getDB() {
  return db.db(dbID);
}

function collection(coll) {
  return getDB().collection(coll);
}

function close() {
  return db.close();
}

// Database methods

async function deleteDocument(payload) {
  return await collection(payload.collectionID).deleteOne({
    _id: ObjectID(payload.objectID),
  });
}

async function dropCollection(payload) {
  return await collection(payload.collectionID).drop();
}

async function createCollection(payload) {
  return await getDB().createCollection(payload.collectionID);
}

async function getCollectionIDs() {
  const colls = await getDB().listCollections().toArray();
  return colls
    .map((coll) => coll.name)
    .filter((name) => name != "system.indexes")
    .sort();
}

async function getDatabaseInfo() {
  const collectionIDs = await getCollectionIDs();
  return Promise.all(
    collectionIDs.map(async (collectionID) => {
      const stats = await getCollectionInfo(collectionID);
      return {
        collectionID: collectionID,
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
      };
    })
  );
}

async function getCollectionInfo(collectionID) {
  return await collection(collectionID).stats();
}

async function getDocuments(payload) {
  const { page, collectionID, query, sort } = payload;
  const offset = (page - 1) * 10;
  const cursor = await collection(collectionID).find(query);
  const count = await cursor.count();
  const results = await cursor.sort(sort).skip(offset).limit(10).toArray();
  return { count, results };
}

async function getDocumentCount(payload) {
  const { collectionID, query } = payload;
  const count = await collection(collectionID).countDocuments(query);
  return count.toString();
}

module.exports = {
  init,
  setConfig,
  getDatabaseID,
  getDB,
  collection,
  close,
  deleteDocument,
  dropCollection,
  createCollection,
  getDatabaseInfo,
  getDocuments,
  getDocumentCount,
};
