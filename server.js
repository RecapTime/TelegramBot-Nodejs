// init project

const Telegraf = require("telegraf");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const data = require("./data");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const { leave } = Stage;
const stage = new Stage();
const { Extra, Markup } = Telegraf;

// Get project slug for Glitch and Heroku deployments, fallbacks to default if none
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet";
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;

// Pull token
const BOT_TOKEN = process.env.TGBOT_TOKEN;
if (BOT_TOKEN.length > 45) {
  console.error("That's too much! Bot tokens must be 45 characters.")
  process.exit(1)
} else if (BOT_TOKEN.length < 45) {
  console.error("")
  process.exit(1)
} else {
  console.log("The bot token is successfully retrived. Looking for app url...")
}

// Automatically resolves webhook URls for different deployments.
const webhookReceiverUrl =
  "https://" +
    GLITCH_PROJECT_SLUG +
    ".glitch.me/telegram/endpoints/${BOT_TOKEN}" ||
  process.env.APP_URL + "/telegram/endpoints/${BOT_TOKEN}" ||
  process.env.NOW_URL + "/telegram/endpoints/${BOT_TOKEN}" ||
  "https://" +
    HEROKU_APP_NAME +
    ".herokuapp.com/telegram/endpoints/${BOT_TOKEN}";

// Get the app base url for diffrent works.
const AppBaseUrl = process.env.APP_URL || "https://"+GLITCH_PROJECT_SLUG+".glitch.me" || process.env.NOW_URL || "https://"+HEROKU_APP_NAME+"herokuapp.com"

// Pull the token to get started.
const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

// Manage scenes
const getBotInfo = new Scene();
getBotInfo.command("about", ctx => ctx.reply("*About the bot*"));

const speedTest = new Scene()
speedTest.command("status", )

// Get bot information and print from console logs
bot.telegram.getMe().then(bot_informations => {
  bot.options.username = bot_informations.username;
  console.log(
    "The webhook endpoint is ready to deploy. Your Telegram bot username is " +
      bot_informations.username
  );
});

bot.on('inline_query', ctx => {
    let query = ctx.update.inline_query.query;  // If you analyze the context structure, query field contains our query.
    if(query.startsWith("/")){  // If user input is @yourbot /command
        if(query.startsWith("/getAudio Example.ogg")){
            // In this case we answer with a list of ogg voice data.
            // It will be shown as a tooltip. You can add more than 1 element in this JSON array. Check API usage "InlineResultVoice".
            return ctx.answerInlineQuery([
                {
                    type: 'voice',  // It's a voice file.
                    id: ctx.update.inline_query.id,    // We reflect the same ID of the request back.
                    title: 'Send audio file sample.ogg',    // Message appearing in tooltip.
                    voice_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
                    voice_duration: 16, // We can specify optionally the length in seconds.
                    caption: '[BOT] Audio file sample.ogg!' // What appears after you send voice file.
                }
            ]);
        }
    }else{  // If user input is @yourbot name
        let name_target = query;    // Let's assume the query is actually the name.
        let message_length = name_target.length;    // Name length. We want to ensure it's > 0.
        if(message_length > 0){
            let full_message;
            let dice=Math.floor(Math.random()*8)+1; // Let's throw a dice for a random message. (1, 8)
            switch(dice){
                case 1: full_message = "Something went berserk went looking for"+name_target; break;
                case 2: full_message = "IMHO, "+name_target+" is awesome"; break;
                case 3: full_message = name_target+" is not a nice people for me..."; break;
                case 4: full_message = name_target+" for me you are c- Eh! You wanted!"; break;
                case 5: full_message = "Whoa! "+name_target+" is very cool!"; break;
                case 6: full_message = "Grifondoro! No wait, "+name_target+" you're such a noob."; break;
                case 7: full_message = "Sometimes I ask myself why people like "+name_target+" dress up and walk around like that..."; break;
                case 8: full_message = "Watch him! Watch! "+name_target+" is so ugly!"; break;
            }
            // Let's return a single tooltip, not cached (In order to always change random value).
            return ctx.answerInlineQuery([{
                type: 'article',
                id: ctx.update.inline_query.id, 
                title: "Our bot doesn't found that.", 
                description: 'The Recap Time bot thoght',
                input_message_content: {message_text: full_message}
            }], {cache_time: 0});
        }
    }
})

bot.use((ctx, next) => {
  const start = new Date()
  return next().then(() => {
    const ms = new Date() - start
    console.log('response time %sms', ms)
  })
})

const app = express();

app.get("/", (req, res) =>
  res.send({
    status: 200,
    description: "Hello world! The service is currently running."
  })
);

app.use(bot.webhookCallback("/telegram/endpoints/${BOT_TOKEN}"));

app.get("/thank-you", (req, res) =>
  res.sendFile(__dirname + "/views/thankyou.html")
);

app.get("/report-a-bug", (req, res) =>
  res.sendFile(__dirname + "/views/report.html")
);

app.get("/telegram/endpoints/${BOT_TOKEN/metadata}", (req, res) =>
       res.))

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    desciption:
      "Something went berserk. Either check the code, consult the docs or contact Support",
    "issueTracker": "https://gitlab.com/MadeByThePinsTeam-DevLabs/"
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(404).send({
    status: 404,
    desciption:
      "Whoops! That didn't found on our side. Check the url or change some code.",
    triggeredErrorUrl: AppBaseUrl
  });
});

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
