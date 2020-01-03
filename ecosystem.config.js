module.exports = {
  apps : [{
    name: 'TELEGRAM_BOT_SERVER',
    script: 'server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      TGBOT_TOKEN: 'yourtokenhere'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      // Change the host Ip address
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:MadeByThePinsTeam-DevLabs/RecapTime-Staff/recaptime-tgbot-nodejs.git',
      path : '/var/www/production',
      "pre-deploy": 'git push',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
