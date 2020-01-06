// init project

const Telegraf = require("telegraf");
const express = require("express");
const mongo = require('mongodb').MongoClient
const axios = require('axios')
const fs = require('fs')
const data = require('./data')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage
const stage = new Stage()

// Get project slug for Glitch and Heroku deployments, fallbacks to default if none
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet";
const HEROKU_APP_URL = process.env.HEROKU_APP_NAME;

// Pull token
const BOT_TOKEN = process.env.TGBOT_TOKEN;

// Automatically resolves webhook URls for different deployments.
const webhookReceiverUrl =
  "https://" +
    GLITCH_PROJECT_SLUG +
    ".glitch.me/telegram/endpoints/${BOT_TOKEN}" ||
  process.env.APP_URL + "/telegram/endpoints/${BOT_TOKEN}" ||
  process.env.NOW_URL + "/telegram/endpoints/${BOT_TOKEN}" ||
  "https://" +
    HEROKU_APP_URL +
    ".herokuapp.com/telegram/endpoints/${BOT_TOKEN}";

// Pull the token to get started.
const bot = new Telegraf(BOT_TOKEN);

// We are using MongoDB for data
mongo.connect(data.mongoLink, {useNewUrlParser: true}, (err, client) => {
  if (err) {
    sendError(err)
  }

  const db = client.db('recaptime_tgbotdb')
  mongo.connect(data.mongoLink, {useNewUrlParser: true}, (err, client) => {
  
  bot.telegram.setWebhook(webhookReceiverUrl)
});

bot.use(session())
bot.use(stage.middleware())

const authWithTGPassport = new Scene

  
const app = express();

app.get("/", (req, res) =>
  res.send({
    status: 200,
    description: "Hello world! The service is currently running."
  })
);

app.use(bot.webhookCallback("/telegram/endpoints/${BOT_TOKEN}"));

app.get("/thank-you", (req, res) => 
       res.sendFile(__dirname + "/views/thankyou.html"))

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .send({
      status: 500,
      desciption:
        "Something went berserk. Either check the code, consult the docs or contact Support"
    });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res
    .status(404)
    .send({
      status: 404,
      desciption: "Whoops! That didn't found on our side. Check the url or change some code."
    });
});

var listener = app.listen(process.env.PORT, function() {
  console.log(
    "Your Express app is listening on port " + listener.address().port
  );
});
  
function updateUser (ctx, active) {
  let jetzt = active ? 'active' : 'blocked'
  db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {status: jetzt}}, {upsert: true, new: true})
}
  
function sendError (err, ctx) {
  if (err.toString().includes('message is not modified')) {
    return
  }
  bot.telegram.sendMessage(data.dev, `Ошибка у [${ctx.from.first_name}](tg://user?id=${ctx.from.id}) \n\nОшибка: ${err}`, { parse_mode: 'markdown' })
}

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
});