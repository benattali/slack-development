const express = require('express');
const Axios = require("axios");
const router = express.Router();

router.get('/', async function(req, res) {
  const developmentChannel = "https://hooks.slack.com/services/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"
  await Axios.post(developmentChannel, {
    text: "ocean breeze",
  })
});

module.exports = router;
