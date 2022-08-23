const { App, ExpressReceiver  } = require('@slack/bolt');
const config = require('./utils/config');

const receiver = new ExpressReceiver({ signingSecret: config.SLACK_SIGNING_SECRET });

const app = new App({
  token: config.SLACK_BOT_TOKEN,
  receiver
});

const rules = {}
rules[config.DEVELOPING_CHANNEL_ID] = {
  details: [{
    keyword: "test", 
    echoToChannelId: "C03QRDHD2MQ",
    channelName: "General"
  }, {
    keyword: "hello", 
    echoToChannelId: "C03QRDHD2MQ",
    channelName: "General"
  }]
};

rules[config.SENDING_CHANNEL_ID] = {
  details: [{
    keyword: "cat", 
    echoToChannelId: config.DEVELOPING_CHANNEL_ID,
    channelName: "Developing"
  }, {
    keyword: "dog", 
    echoToChannelId: "C03QRDHD2MQ",
    channelName: "General"
  },
  {
    keyword: "test", 
    echoToChannelId: config.DEVELOPING_CHANNEL_ID,
    channelName: "Developing"
  }]
};

const ruleKeys = Object.keys(rules);

ruleKeys.forEach((ruleKey) => {
  const channelRules = rules[ruleKey].details;

  channelRules.forEach((channelRule) => {
    app.message(channelRule.keyword, ({ message, client }) => {
      if (message.channel === ruleKey) {
        client.chat.postMessage({channel: channelRule.echoToChannelId, text: `copy of ${message.text}!`});
      }
    });
  });
});

receiver.router.get('/test', (req, res) => {
  res.send('yay!');
});

app.command('/showrules', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();
  const displayRules = Object.keys(rules);
  // TODO: Only print rules for the channel we are in
  displayRules.forEach(async (ruleKey) => {
    const channelRules = rules[ruleKey].details;
    const listeningToChannel = ruleKey;
    channelRules.forEach(async (channelRule) => {
      await say(`Listening on: ${listeningToChannel}: ${channelRule.keyword} ---> ${channelRule.channelName}`);
    })
  })
});

app.command('/addrule', async ({ command, ack, say }) => {
  await ack();

  console.log(command)
  const newRule = {
    channelId: command.channel_id,
    keyword: command.text,
    channelName: command.channel_name,
  };
  rules.push(newRule);
  console.log(rules);
  await say(`Added ${newRule.keyword} ---> ${newRule.channelName}`);
});

(async () => {
  await app.start(config.PORT);
  console.log(`Running on port ${config.PORT}`)

  console.log('⚡️ Bolt app is running!');
})();
