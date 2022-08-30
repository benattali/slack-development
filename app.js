const { App, ExpressReceiver  } = require('@slack/bolt')
const config = require('./utils/config')
const mongoose = require('mongoose')
const Rule = require('./models/rule')

const receiver = new ExpressReceiver({ signingSecret: config.SLACK_SIGNING_SECRET })

const app = new App({
  token: config.SLACK_BOT_TOKEN,
  receiver
})

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

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
}

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
}

const ruleKeys = Object.keys(rules)

ruleKeys.forEach((ruleKey) => {
  const channelRules = rules[ruleKey].details

  channelRules.forEach((channelRule) => {
    app.message(channelRule.keyword, ({ message, client }) => {
      if (message.channel === ruleKey) {
        client.chat.postMessage({channel: channelRule.echoToChannelId, text: `copy of ${message.text}!`});
      }
    })
  })
})

receiver.router.get('/test', (req, res) => {
  res.send('yay!')
});

app.command('/showrules', async ({ command, ack, say }) => {
  // Acknowledge command request
  // TODO: Add index on listeningChannelId for quick lookup here
  await ack()
  channelRules = await Rule.find({ listeningChannelId: command.channel_id });
  console.log(channelRules)
  channelRules.forEach(async (channelRule) => {
    await say(`${channelRule.keyword} ---> ${channelRule.echoToChannelName}`)
  })

})

app.command('/addrule', async ({ command, ack, say }) => {
  await ack()

  const textArr = command.text.split(" ")
  const keyword = textArr[0]
  const channelToSend = textArr[1].match(/([A-Z])\w+/)[0]
  const channelNameToSend = textArr[1].match(/(?!\|)([a-z])+/)[0]
  const rule = new Rule({
    listeningChannelId: command.channel_id,
    echoToChannelId: channelToSend,
    keyword: keyword,
    echoToChannelName: channelNameToSend,
  })
  await rule.save()

  await say(`Added ${rule.keyword} ---> ${rule.echoToChannelName}`)
});

(async () => {
  await app.start(config.PORT);
  console.log(`Running on port ${config.PORT}`)

  console.log('⚡️ Bolt app is running!')
})()
