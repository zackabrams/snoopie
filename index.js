
var SlackBot = require('slackbots');
var fs = require('fs');
require('dotenv').config();

// create a bot

const token1 = process.env.BWOGTOKEN
var bot = new SlackBot({
  token: token1,
  name: 'snoopie'
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':dog:',
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

bot.on('message', function(data) {
    var params = {
        icon_emoji: ':dog:',
        link_names: 'true'
    };

    if (data.type === 'message' && data.text.includes('.now') || data.text.includes('.realtime') || data.text.includes('.users') || data.text.includes('.live')) {

        userlist = bot.getUsers();
        userarray = userlist._value.members;
        obj1 = userarray.find(o => o.id === data.user);
        user_name = obj1.profile.first_name;
        console.log(obj1)
        username = obj1.name;

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
              result = result.data.rows.toString()
              var cleanresult = result += ",";
              cleanresult = result.replace(/Bwog » /g,"\n").replace(/,1,/g,' (1)').replace(/,2,/g,' (2)').replace(/,3,/g,' (3)').replace(/,4,/g,' (4)')
              messagetext = "Beep Boop! Hey "+user_name+" , the pages currently being viewed are\n"+cleanresult;
              bot.postMessageToUser(username, messagetext, params);
              return;

            })
            }
          )
        }
      });
