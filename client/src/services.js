const axios = require("axios");

export default async function Request(uri, payload = {}) {
  return await axios.post("/api" + uri, JSON.stringify(payload));
}

export async function DeleteDocument(payload) {
  return await axios.post("/api/delete-document", payload);
}

export async function DropCollection(payload) {
  return await axios.post("/api/drop-collection", payload);
}

export async function CreateCollection(payload) {
  return await axios.post("/api/create-collection", payload);
}

export async function GetDatabaseInfo() {
  return await axios.post("/api/get-database-info");
}

export async function GetDocuments(payload) {
  return await axios.post("/api/get-documents/" + JSON.stringify(payload));
}

export async function GetDocumentCount(payload) {
  return await axios.post("/api/get-document-count/" + JSON.stringify(payload));
}

export async function GetDatabaseID() {
  return await axios.post("/api/get-database-id");
}
