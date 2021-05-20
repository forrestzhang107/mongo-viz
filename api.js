const express = require("express");
const config = require("./config.json");
const db = require("./mongo");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/delete-document", async (req, res) => {
  await db.deleteDocument(req.body);
  res.sendStatus(200);
});

router.post("/drop-collection", async (req, res) => {
  try {
    await db.dropCollection(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/create-collection", async (req, res) => {
  try {
    await db.createCollection(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/get-database-info", async (req, res) => {
  const data = await db.getDatabaseInfo();
  res.send(data);
});

router.post("/get-documents/:payload", async (req, res) => {
  const payload = JSON.parse(req.params.payload);
  const data = await db.getDocuments(payload);
  res.send(data);
});

router.post("/get-document-count/:payload", async (req, res) => {
  const payload = JSON.parse(req.params.payload);
  const data = await db.getDocumentCount(payload);
  res.send(data);
});

router.post("/get-database-id", (req, res) => {
  res.send(db.getDatabaseID());
});

module.exports = router;
