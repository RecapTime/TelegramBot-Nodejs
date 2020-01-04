# Locally testing your Node.js Telegram bot

You can locally use the project's source

## Requirements
- LTS release of Node.js
- Latest build of `npm` or any package manager for Node
- Git command line

## Instructions
See README for some commands and other stuff.

- Install Node first.
- Clone the Git repo.
- Configure environment variables, as we're using webhooks
- Remove the following code belwo
```js
// Remove the code below for local deployments and deployments outside Glitch.com
process.on("SIGTERM", function () {
  console.log("SIGTERM received, sending SOS to Resurrect...");
  require('https').get("https://resurrect.glitch.me/"+process.env.PROJECT_DOMAIN+"/optional/path/here", process.exit);
});
```