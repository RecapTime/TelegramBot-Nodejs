// init project
const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require("body-parser");
const { QueueManager } = require("node-telegram-operation-manager");


// Pull token from environment variables, start with your Telegram Bot token
const token = process.env.TGBOT_TOKEN;

// Get url and port from env
const url = process.env.APP_URL;
const port = process.env.PORT;

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
      "Currently, the bot is still work in process and everyone can",
    { parse_mode: "markdown" }
  );
});
