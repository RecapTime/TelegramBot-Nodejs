// init project
var fs = require("fs");
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
// In case of Zeit Now, either use 443 or customize it.
const port = process.env.PORT || 443;
// For
const GLITCH_PROJECT_SLUG = process.env.PROJECT_DOMAIN;

// Start the bot
const bot = new TelegramBot(token);

// Get the channel ID of your bot status channel
// See the docs for details
const statusChannel = 74903294;

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/webhook/tgbot-${token}`);

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/webhook/tgbot-${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Documentation Files
app.use(express.static("public"));

function getFilesInDirectory(dir) {
  return [].concat(
    ...fs.readdirSync(dir).map(name => {
      const path = dir + "/" + name;
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        return getFilesInDirectory(path);
      } else if (stats.isFile()) {
        return [path];
      }
      return [];
    })
  );
}

app.get("/docs", function(request, response) {
  const files = {};
  getFilesInDirectory("docs")
    .sort()
    .forEach(path => {
      const fileName = path.replace(/docs\/(.*)\.md/, "$1"); //trim off "docs/" and ".md"
      files[fileName] = fs.readFileSync(path, "utf8");
    });
  response.send(files);
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/offline", function(request, response) {
  response.sendFile(__dirname + "/views/offline.html");
});

app.get("/manifest.json", function(request, response) {
  response.sendFile(__dirname + "/views/manifest.json");
});

// Handle 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + "/views/404.html");
});

// Handle 500 errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ "issue": "Something went berserk. Contact Support or check your code." });
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

//

// Matches "/echo [whatever]"
bot.onText(/\/start/, msg => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    "Welcome to *Recap Time* bot!" + "\n\n" + "* Explore the bot",
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        keyboard: [["Explore", "My Account"], ["About bot"], ["Send feedback"]]
      }
    }
  );
});

bot.onText(/\/contribute/, msg => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "*We are open for contributions*" + "\n\n" + "If you want to", {
    parse_mode: "MarkdownV2",
    reply_markup: {
      keyboard: [["Back to main menu"]]
    }
  });
});

// Remove the code below for local deployments and deployments outside Glitch.com
// It's better to get your own copy of this project.
process.on("SIGTERM", function() {
  console.log(
    "SIGTERM received, sending SOS to Resurrect... [Issued on: " +
      Date.now() +
      "]"
  );
  require("https").get(
    "https://resurrect.glitch.me/" +
      GLITCH_PROJECT_SLUG +
      "/optional/path/here",
    process.exit
  );
});
