const { App, ExpressReceiver  } = require('@slack/bolt')
const config = require('./utils/config')
const mongoose = require('mongoose')
const Rule = require('./models/rule')
const { setListener } = require('./utils/helpers')

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

async function initializeRules() {
  const allRules = await Rule.find({})

  allRules.forEach((rule) => {
    setListener(app, rule)
  })
}

// example of creating a new route if we need to
receiver.router.post('/create-rule', (req, res) => {
  res.status(200).end()
});

app.command('/showrules', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack()
  // TODO: Add index on listeningChannelId for quick lookup here
  channelRules = await Rule.find({ listeningChannelId: command.channel_id });
  channelRules.forEach(async (channelRule) => {
    await say(`${channelRule.keyword} ---> ${channelRule.echoToChannelName}`)
  })

})

// Not working
app.view({ callback_id: 'view_1', type: 'view_closed' }, async ({ ack, body, view, client }) => {
  // Acknowledge the view_closed request
  await ack();
  // react on close request
  console.log("********", body)
});

// Not working
app.view('view_1', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack();
  console.log("********")
  const val = view['state']['values']['input_channel']['channel_name_input'];
  console.log(val)
}, async ({payload}) => {
  console.log(payload)
})

app.command('/addrule', async ({ ack, body, client, logger }) => {
  await ack()

  try {
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Rule Configuration'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'input_channel',
            label: {
              type: 'plain_text',
              text: 'What channel do you want to echo to?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'channel_name_input',
              multiline: false
            }
          },
          {
            type: 'input',
            block_id: 'input_keyword',
            label: {
              type: 'plain_text',
              text: 'What keyword should this rule listen for?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'keyword_input',
              multiline: false
            }
          }
        ],
        // TODO: Add validation around input/block submission without input
        submit: {
          type: 'plain_text',
          text: 'Submit'
        },
        notify_on_close: true
      }
    });
    logger.info(result);
  } catch (e) {
    logger.error(error);
  }

  // const textArr = command.text.split(" ")
  // const keyword = textArr[0]
  // const channelToSend = textArr[1].match(/([A-Z])\w+/)[0]
  // const channelNameToSend = textArr[1].match(/(?!\|)([a-z])+/)[0]
  // const rule = new Rule({
  //   listeningChannelId: command.channel_id,
  //   echoToChannelId: channelToSend,
  //   keyword: keyword,
  //   echoToChannelName: channelNameToSend,
  // })
  // await rule.save()
  // setListener(app, rule)
});

(async () => {
  await app.start(config.PORT);
  console.log(`Running on port ${config.PORT}`)
  console.log('⚡️ Bolt app is running!')

  initializeRules()
})()
