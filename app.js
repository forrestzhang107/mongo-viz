const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const program = require('commander')
const open = require('open')
const config = require('./config')
const api = require('./routes/api')
const mongo = require('./core/mongo')

program
  .option('-H, --hostname <hostname>')
  .option('-N, --port <port>')
  .option('-U, --username <username>')
  .option('-P, --password <password>')
  .option('-D, --database <database>')
  .option('-C, --configFile')
  .parse(process.argv)

if (program.configFile) config.setConfig(require('./configFile.json'))
else config.setConfig({
  hostname: program.hostname || null,
  port: program.port || null,
  username: program.username || null,
  password: program.password || null,
  database: program.database || null,
})

const nulls = []
const serverConfig = config.getConfig()
for (const prop of Object.keys(serverConfig)) if (!serverConfig[prop]) nulls.push(prop)
if (nulls.length != 0) {
  console.log('Missing server configuration: ' + nulls.join(', '))
  return console.log('Please use: node app -H [hostname] -N [port] -U [username] -P [password] -D [database]')
}

const app = express()

app.use(bodyParser.json())
app.use('/api', api)
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')))

mongo.init().then(async () => {
  app.listen(1234)
  console.log('MongoDB Visualizer serving port 1234')
  open('http://localhost:1234')
})
