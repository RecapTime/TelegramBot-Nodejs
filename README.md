Recap Time Node.js Telegram Bot
===========

The Telegram bot for our [Recap Time bot](https://t.me/RecapTime_bot) is fully re-written in Node.js from strach. 

If you want to contribute, please use [our GitLab mirror](https://gitlab.com/MadeByThePinsTeam-DevLabs/RecapTime-Staff/recaptime-tgbot-nodejs) and [the original Glitch project](https://glitch.com/edit/#!/handsome-sheet). We'll stop our support services for GitHub users, so our apologies.
## Setup and Usage

### Local Testing
For development and do tests locally, you need to 

- Install latest LTS release of Node.js (`12.x` as of `0.5.0-canary`)
  - When Node.js is installed, latest build of `npm` is pre-installed, so no extra work required
- Clone the Git repository.
```bash
## Clone from Glitch
git clone https://api.glitch.com/git/handsome-sheet

## Or, prefer to clone from GitLab.com
git clone https://gitlab.com/MadeByThePinsTeam-DevLabs/RecapTime/tgbot-nodejs
```
- Open `.env.test` file and configure environment variables.
```bash
## Get token from BotFather after creating your bot or after rolling some.
export TGBOT_TOKEN=<your token from @BotFather>

## Set APP_URL for webhooks, must be on secure connections as per Telegram Bots API Documentation
export APP_URL=https://myapp.you-and-me.dev

## Set PORT to 3000, but take your pick.
export PORT=3000
```
- Edit `server.js` as usual. See `docs/LOCAL_TESTING.md`
- If you satsified, run `npm start`

### Deploy on Glitch.com
1. [Remix the project](https://glitch.com/edit/#!/remix/handsome-sheet), copy contents from `.env.test` file.
2. Edit the `server.js` as usual.
3. It auto-deploys as usual, no `npm start` needed.