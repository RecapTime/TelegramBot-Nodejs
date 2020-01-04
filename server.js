// init project
const express = require('express');
const app = express();
const fs = require('fs')


// Glitch Slug
const GLITCH_PROJECT_SLUG = process.PROJECT_DOMAIN || "handsome-sheet"

function getFilesInDirectory(dir) {
  return [].concat(...fs.readdirSync(dir).map(name => {
    const path = dir + '/' + name;
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      return getFilesInDirectory(path);
    } else if (stats.isFile()) {
      return [path];
    } 
    return [];
  }));
}

//
app.get("/docs", function (request, response) {
  response.header("Cache-Control", "max-age=0");
  const files = {};
  getFilesInDirectory('md').sort().forEach(path => {
    const fileName = path.replace(/docs\/(.*)\.md/, '$1'); //trim off "md/" and ".md"
    files[fileName] = fs.readFileSync(path, 'utf8');
  });
  response.send(files);
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

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
