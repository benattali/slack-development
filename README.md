1. [Download and install ngrok](https://ngrok.com/download)
  - create an account and authenticate it
2. add a `.env` file to the root of the project
3. add the required environment variables to the `.env` file
4. run `npm install`
5. run `npm start`
6. in a new terminal window run `ngrok http 3000`
7. edit the [Interactivity](https://api.slack.com/apps/A03UL32MZQC/interactive-messages), [Event Subscriptions](https://api.slack.com/apps/A03UL32MZQC/event-subscriptions) and [Slash Commands](https://api.slack.com/apps/A03UL32MZQC/slash-commands) request urls to use the new ngrok url from step 6
