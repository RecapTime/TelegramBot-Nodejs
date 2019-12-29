Recap Time Bot
===========

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
```
## Get token after creating your bot
export TGBOT_TOKEN=<your token from @BotFather>
```

### Deploy on Glitch.com
1. [Remix the project](https://glitch.com/edit/#!/remix/handsome-sheet), copy contents from `.env.test` file.
2. Edit the `server.js` as usual.
3. It auto-deploys