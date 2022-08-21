const { App, ExpressReceiver  } = require('@slack/bolt');
const config = require('./utils/config');

const receiver = new ExpressReceiver({ signingSecret: config.SLACK_SIGNING_SECRET });

const app = new App({
  token: config.SLACK_BOT_TOKEN,
  receiver
});

app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

receiver.router.get('/test', (req, res) => {
  res.send('yay!');
});

app.command('/message', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say("slack me a message");
});

(async () => {
  await app.start(config.PORT);

  console.log('⚡️ Bolt app is running!');
})();
