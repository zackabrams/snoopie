
var SlackBot = require('slackbots');
var fs = require('fs');
require('dotenv').config();

// create a bot

// const token1 = process.env.BWOGTOKEN
// console.log(token1);
var bot = new SlackBot({
  token: process.env.BWOGTOKEN,
  name: 'poopie'
});

var currentlyPooping = 0;

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':poop:',
        link_names: 'true'
    };
    daataa = bot.getUsers()._value.members
    fs.writeFile('Output.txt', JSON.stringify(daataa), function (err) {
    if (err) throw err;
    console.log('Saved!');
    });
    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    bot.postMessageToChannel('shhhhtesting', "Hello! I'm starting.", params);
    channellist = bot.getChannels();

});

function poopAlert() {
    var params = {
        icon_emoji: ':poop:',
        link_names: 'true'
    };

    const { google } = require('googleapis')
    const fs = require('fs')

    const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
    const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes)
    const view_id = '198211958'

    jwt.authorize((err, response) => {
      google.analytics('v3').data.realtime.get(
        {
          auth: jwt,
          ids: 'ga:' + view_id,
          metrics: 'rt:activeUsers',
          dimensions: 'rt:pageTitle'

        },
        (err, result) => {
          console.log(result.data.rows)
          var analData = result.data.rows
          var string = analData.toString()
          var poop = string.search("Poopin' In Pupin")
          console.log(poop)
          if (poop == -1 && currentlyPooping == 0) {
            currentlyPooping = 0;
          } else if (poop == -1 && currentlyPooping == 1) {
            currentlyPooping = 0;
            bot.postMessageToChannel('overseen_overheard', "_Someone is done using Bwog to figure out where to poop_", params)
            console.log("Someone is done using Bwog to figure out where to poop")
          } else if (poop >= 0 && currentlyPooping == 0) {
            currentlyPooping = 1;
            bot.postMessageToChannel('overseen_overheard', "_Someone has finished using Bwog to figure out where to poop_", params)
            console.log("Someone is using Bwog to figure out where to poop")
          }
        }

      )
    })

};

var interval = setInterval(function () { poopAlert(); }, 5000);
