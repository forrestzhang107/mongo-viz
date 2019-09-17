const axios = require('axios')

export async function DeleteDocument(payload) {
  return await axios.post('/api/delete-document', payload)
}

export async function DropCollection(payload) {
  return await axios.post('/api/drop-collection', payload)
}

export async function CreateCollection(payload) {
  return await axios.post('/api/create-collection', payload)
}

export async function GetDatabaseInfo() {
  return await axios.get('/api/get-database-info')
}

export async function GetDocuments(payload) {
  return await axios.get('/api/get-documents/' + JSON.stringify(payload))
}

export async function GetDocumentCount(payload) {
  return await axios.get('/api/get-document-count/' + JSON.stringify(payload))
}

export async function GetServerConfig() {
  return await axios.get('/api/get-server-config')
}
