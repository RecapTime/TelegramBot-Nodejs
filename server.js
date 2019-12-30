// init project
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

app.use(express.static('public'))
app.use(express.static('views'))

// Start Express Server
app.listen(port, () => {
  // Test
  console.log(
    "Express.js endpoint now listening on " +
      process.env.APP_URL +
      ":" +
      process.env.PORT
  );
});

// Matches "/echo [whatever]"
bot.onText(/\/start/, msg => {
  // 'msg' is the received Message from Telegram

  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(
    chatId,
    "Welcome to the *Recap Time bot!*" +
      "\n\n" +
      "Currently, the bot is still work in process and everyone can contribute to improve the bot." +
    "\n\n" +
    "To contribute, use",
    { parse_mode: "markdown" }
  );
});

// Remove the code below for local deployments and deployments outside Glitch.com
process.on("SIGTERM", function () {
  console.log("SIGTERM received, sending SOS to Resurrect...");
  require('https').get("https://resurrect.glitch.me/"+process.env.PROJECT_DOMAIN+"/optional/path/here", process.exit);
});