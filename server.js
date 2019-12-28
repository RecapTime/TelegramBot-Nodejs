// init project
const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");

// Pull token from environment variables
const token = process.env.TGBOT_TOKEN;

// Start the bot
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, msg => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to the **Recap Time Bot**! The bot is currently work in progress. More features soon!" +
      "\n\n" +
      "`Version 0.5.0-canary Released on 12-28-2019 by Andrei Jiroh Halili (@AJHalili2006)`",
    { parse_mode: "Markdown" }
  );
});

bot.on("message", msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "I heard you about that. Processing data..."
  );
});
