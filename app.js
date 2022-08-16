const config = require('./utils/config');
const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  port: config.PORT,
});

app.event('message', async ({ event, client }) => {
  // Do some slack-specific stuff here
  await client.chat.postMessage({
    channel: "C03RF614EN4",
    text: "test",
  });
});

receiver.router.get('/', (req, res) => {
  res.json('show me something');
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();
