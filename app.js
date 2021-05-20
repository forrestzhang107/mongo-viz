const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const program = require("commander");
const open = require("open");
const chalk = require("chalk");
const api = require("./api");
const mongo = require("./mongo");
const config = require("./config.json");

program
  .option("-D, --database <database>")
  .option("--devmode")
  .parse(process.argv);

if (program.database) {
  const [uri, database] = config[program.database];
  if (!uri)
    return console.log(`Database ${program.database} missing in config.json`);
  mongo.setConfig([uri, database]);
} else {
  return console.log("Please use: node app -D [database]");
}

const app = express();

// log requests
app.use((req, res, next) => {
  const path = decodeURI(req.path);
  if (
    ["static", "manifest.json", "favicon.ico", "logo192.png"].includes(
      path.split("/")[1]
    )
  )
    return next();
  const method = req.method;
  if (method == "GET")
    console.log(`${chalk.white.bgGreen(` ${method} `)} ${path}`);
  if (method == "POST")
    console.log(`${chalk.white.bgMagenta(` ${method} `)} ${path}`);
  return next();
});

app.use(bodyParser.json());
app.use("/api", api);
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "build", "index.html"))
);

mongo.init().then(async () => {
  app.listen(1234);
  console.log("MongoDB Visualizer serving port 1234");
  if (!program.devmode) open("http://localhost:1234");
});
