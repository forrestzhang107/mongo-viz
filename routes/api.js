const express = require('express')
const config = require('../config')
const db = require('../core/mongo')

const router = express.Router()

router.get('/ping', (req, res) => {
  res.send('pong')
})

router.post('/delete-document', async (req, res) => {
  await db.deleteDocument(req.body)
  res.sendStatus(200)
})

router.post('/drop-collection', async (req, res) => {
  try {
    await db.dropCollection(req.body)
    res.sendStatus(200)
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.post('/create-collection', async (req, res) => {
  try {
    await db.createCollection(req.body)
    res.sendStatus(200)
  }
  catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.get('/get-database-info', async (req, res) => {
  const data = await db.getDatabaseInfo()
  res.send(data)
})

router.get('/get-documents/:payload', async (req, res) => {
  const payload = JSON.parse(req.params.payload)
  const data = await db.getDocuments(payload)
  res.send(data)
})

router.get('/get-document-count/:payload', async (req, res) => {
  const payload = JSON.parse(req.params.payload)
  const data = await db.getDocumentCount(payload)
  res.send(data)
})

router.get('/get-server-config', (req, res) => {
  const data = config.getConfig()
  res.send(data)
})

module.exports = router
