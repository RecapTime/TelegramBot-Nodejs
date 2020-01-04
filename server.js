// init project
const express = require('express');
const app = express();
const fs = require('fs')


// Glitch Slug
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet"

app.get('/', (res, rep) =>
       res.sendFile(__dirname + "/docs/index.html")
);


var listener = app.listen(process.env.PORT, function () {
  console.log('Your Express app is listening on port ' + listener.address().port);
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
