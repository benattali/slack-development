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
  console.log("********")
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
          text: 'Modal title'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          },
          {
            type: 'input',
            block_id: 'input_c',
            label: {
              type: 'plain_text',
              text: 'What are your hopes and dreams?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'dreamy_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });

    logger.info("****", result);
  } catch (e) {
    logger.error(error);
  }
  logger.info()

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
