// init project
var fs = require('fs');
const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require("body-parser");

// Extend bot features with community builds
const { QueueManager } = require("node-telegram-operation-manager");

// Pull token from environment variables, start with your Telegram Bot token
const token = process.env.TGBOT_TOKEN;

// Get url and port from env. The NOW_URL is reserved for Zeit Now deployments
const url = process.env.APP_URL || process.env.NOW_URL;
const port = process.env.PORT || 443;

// Start the bot
const bot = new TelegramBot(token);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/webhook/tgbot-${token}`);

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/webhook/tgbot-${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Redirect remote files to secure side
function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    //console.log("https, yo")
    return next()
  } else {
    //console.log("just http")
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps)

// Documentation Files
app.use(express.static('public'));

function getFilesInDirectory(dir) {
  return [].concat(...fs.readdirSync(dir).map(name => {
    const path = dir + '/' + name;
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      return getFilesInDirectory(path);
    } else if (stats.isFile()) {
      return [path];
    } 
    return [];
  }));
}

app.get("/docs", function (request, response) {
  response.header("Cache-Control", "max-age=0");
  const files = {};
  getFilesInDirectory('md').sort().forEach(path => {
    const fileName = path.replace(/md\/(.*)\.md/, '$1'); //trim off "md/" and ".md"
    files[fileName] = fs.readFileSync(path, 'utf8');
  });
  response.send(files);
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/offline", function (request, response) {
  response.sendFile(__dirname + '/views/offline.html');
});

app.get("/manifest.json", function (request, response) {
  response.sendFile(__dirname + '/views/manifest.json');
});

app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/404.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



// Remove the code below for local deployments and deployments outside Glitch.com
process.on("SIGTERM", function() {
  console.log("SIGTERM received, sending SOS to Resurrect...");
  require("https").get(
    "https://resurrect.glitch.me/" +
      process.env.PROJECT_DOMAIN +
      "/optional/path/here",
    process.exit
  );
});
