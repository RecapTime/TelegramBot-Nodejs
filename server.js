// init project
const express = require('express');
const app = express();
const fs = require('fs')


// Glitch Slug
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet"

//
app.get("/docs", function (request, response) {
  response.header("Cache-Control", "max-age=0");
  const files = {};
  getFilesInDirectory('md').sort().forEach(path => {
    const fileName = path.replace(/md\/(.*)\.md/, '$1'); //trim off "md/" and ".md"
    files[fileName] = fs.readFileSync(path, 'utf8');
  });
  response.send(files);
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
