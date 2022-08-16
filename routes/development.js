const config = require('./utils/config');
const express = require('express');
const Axios = require("axios");
const router = express.Router();

router.get('/', async function(req, res) {
  const developmentChannel = config.DEV_CHANNEL
  await Axios.post(developmentChannel, {
    text: "ocean breeze",
  })
});

module.exports = router;
