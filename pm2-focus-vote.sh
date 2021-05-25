#!/bin/sh

npm run compile

# Start each 2 min at 15 second

pm2 delete focus-vote
CRON="15 */11 * * * *" pm2 start --name focus-vote focus_vote.js
pm2 save