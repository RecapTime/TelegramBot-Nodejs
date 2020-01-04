// init project

const Telegraf = require('telegraf')
const express = require('express')

const bot = new Telegraf(process.env.BOT_TOKEN)

// Get project slug for Glitch and Heroku deployments, fallbacks to default if none
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet";
const HEROKU_APP_URL = process.env.HEROKU_APP_NAME

// By default, its fallback to
const webhookReceiverUrl = "https://" + GLITCH_PROJECT_SLUG + ".glitch.me" || process.env.APP_URL || process.env.NOW_URL || "https://" + HEROKU_APP_URL + ".herokuapp.com"

const app = express();

app.get("/", (req, res) => res.send({ status: 200, "description": "Hello world! The service is currently running."}));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({status: 500, desciption: 'Something went berserk. Either check the code, consult the docs or contact Support'})
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).send({status: 404, desciption: 'Whoops! That didn\'t found on our side.'})
})

var listener = app.listen(process.env.PORT, function() {
  console.log(
    "Your Express app is listening on port " + listener.address().port
  );
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
