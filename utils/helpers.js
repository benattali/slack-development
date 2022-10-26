function setListener(app, rule) {
  app.message(rule.keyword, async ({ message, client }) => {
    if (message.channel === rule.listeningChannelId) {
      try {
        await client.chat.postMessage({channel: rule.echoToChannelId, text: `copy of ${message.text}!`})
      }
      catch (err) {
        await client.chat.postMessage({channel: rule.listeningChannelId, text: `unable to echo message to channel: <#${rule.echoToChannelId}>`, thread_ts: message.ts})
      }
    }
  })
}

module.exports = { setListener }
