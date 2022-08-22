const { App, ExpressReceiver  } = require('@slack/bolt');
const config = require('./utils/config');

const receiver = new ExpressReceiver({ signingSecret: config.SLACK_SIGNING_SECRET });

const app = new App({
  token: config.SLACK_BOT_TOKEN,
  receiver
});

const rules = [
    {
      channelId: config.DEVELOPING_CHANNEL_ID,
      keyword: "flotz",
      channelName: "developing",
    },
    {
      channelId: config.SENDING_CHANNEL_ID,
      keyword: "tanya",
      channelName: "sending",
    },
  ]


app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

receiver.router.get('/test', (req, res) => {
  res.send('yay!');
});

app.command('/showrules', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`${rules[0].keyword} ---> ${rules[0].channelName}\n${rules[1].keyword} ---> ${rules[1].channelName}`);
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

  console.log('⚡️ Bolt app is running!');
})();
