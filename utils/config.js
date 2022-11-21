require('dotenv').config()

const PORT = process.env.PORT
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  PORT,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  MONGODB_URI,
}
