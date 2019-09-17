const config = require('../config')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

let connection
let connected

async function init() {
  if (!connected) await connect()
}

exports.init = init

async function deleteDocument(payload) {
  return await collection(payload.collectionID)
    .deleteOne({'_id': ObjectID(payload.objectID)})
}

exports.deleteDocument = deleteDocument

async function dropCollection(payload) {
  return await collection(payload.collectionID).drop()
}

exports.dropCollection = dropCollection

async function createCollection(payload) {
  return await getDB().createCollection(payload.collectionID)
}

exports.createCollection = createCollection

async function getCollections() {
  const res = await getDB().listCollections().toArray()
  const output = []
  res.forEach(collection => {
    const name = collection.name
    if (name != 'system.indexes') output.push(name)
  })
  return output
}

async function getDatabaseInfo() {
  const collectionIDs = await getCollections()
  return Promise.all(collectionIDs.map(async collectionID => {
    const stats = await getCollectionStats(collectionID)
    return {
      collectionID: collectionID,
      count: stats.count,
      size: stats.size,
      avgObjSize: stats.avgObjSize,
    }
  }))
}

exports.getDatabaseInfo = getDatabaseInfo

async function getCollectionStats(collectionID) {
  return await collection(collectionID).stats()
}

async function getDocuments(payload) {
  const page = payload.page
  const docs = await collection(payload.collectionID)
    .find(payload.query)
    .sort(payload.sort)
    .limit(10*page)
    .toArray()
  const output = []
  for (let i = 10*(page-1); i < 10*page; i++) if (docs[i]) output.push(docs[i])
  return output
}

exports.getDocuments = getDocuments

async function getDocumentCount(payload) {
  const count = await collection(payload.collectionID)
    .count(payload.query)
  return count.toString()
}

exports.getDocumentCount = getDocumentCount

async function connect() {
  const serverConfig = config.getConfig()
  const url = 'mongodb://' + serverConfig.username
  + ':' + serverConfig.password
  + '@' + serverConfig.hostname
  + ':' + serverConfig.port
  + '/' + serverConfig.database
  try {
    connection = await MongoClient.connect(url)
    connected = true
  }
  catch(e) {
    console.log(e.stack)
  }
}

function getDB() {
  const database = config.getConfig().database
  return connection.db(database)
}

exports.getDB = getDB

function collection(collectionID) {
  return getDB().collection(collectionID)
}

exports.collection = collection

function close() {
  return connection.close()
}

exports.close = close
