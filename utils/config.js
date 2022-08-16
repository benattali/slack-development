require('dotenv').config()

const PORT = process.env.PORT
const DEV_CHANNEL = process.env.DEV_CHANNEL

module.exports = {
  PORT,
  DEV_CHANNEL
}
