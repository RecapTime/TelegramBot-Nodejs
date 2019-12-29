// init project
const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require("body-parser");

// Pull token from environment variables, start with your Telegram Bot token
const token = process.env.TGBOT_TOKEN;

//
const url = process.env.APP_URL;
const port = process.env.PORT;

// Start the bot
const bot = new TelegramBot(token);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/webhook/tgbot-${token}`);

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  // Test
  console.log(
    "Express.js endpoint now listening on " + process.env.APP_URL + ":" + process.env.PORT
  );
});

// Just to ping!
bot.on("message", msg => {
  bot.sendMessage(msg.chat.id, "I am alive!");
});
