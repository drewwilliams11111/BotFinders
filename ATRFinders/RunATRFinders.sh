#!/bin/bash
if ps -aux | grep -v grep | grep ATRFinder.js > /dev/null
then
  echo "ATR Finder is running."
else
  cd /home/ubuntu/BotFinders/ATRFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinder.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderSmall.js > /dev/null
then
  echo "ATR Finder Small is running."
else
  cd /home/ubuntu/BotFinders/ATRFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderSmall.js >> ../Error.log 2>&1
fi