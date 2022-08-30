const mongoose = require('mongoose')

const ruleSchema = new mongoose.Schema({
  echoToChannelId: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  echoToChannelName: {
    type: String,
    required: true,
  },
  listeningChannelId: {
    type: String,
    required: true,
  }
  // TODO: consider adding a unique hash to validate
  // echoToChannelId, keyword & listeningChannelId are 
  // unique
})

ruleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Rule', ruleSchema)
