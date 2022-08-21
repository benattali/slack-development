1. [Download and install ngrok](https://ngrok.com/download)
  - create an account and authenticate it
2. add a `.env` file to the root of the project
3. add the required environment variables to the `.env` file
4. run `npm install`
5. run `npm start`
6. in a new terminal window run `ngrok http 3000`
7. edit the "Event Subscriptions" and "Slash Commands" request urls to use the new ngrok url from step 6
