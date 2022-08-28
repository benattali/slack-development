const mongoose = require('mongoose')

const ruleSchema = new mongoose.Schema({
  channelIdToSend: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  channelNameToSend: {
    type: String,
    required: true,
  },
})

ruleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Rule', ruleSchema)
