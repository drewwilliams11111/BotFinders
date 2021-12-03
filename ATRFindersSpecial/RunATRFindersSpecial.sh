#!/bin/bash
if ps -aux | grep -v grep | grep ATRFinderSpecial.js > /dev/null
then
  echo "ATR Finder Special is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersSpecial && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderSpecial.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderSpecialSmall.js > /dev/null
then
  echo "ATR Finder Special Small is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersSpecial && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderSpecialSmall.js >> ../Error.log 2>&1
fi