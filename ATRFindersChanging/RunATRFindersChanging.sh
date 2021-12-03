#!/bin/bash
if ps -aux | grep -v grep | grep ATRFinderChanging.js > /dev/null
then
  echo "ATR Finder Changing is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChanging2.js > /dev/null
then
  echo "ATR Finder Changing 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChangingSmall.js > /dev/null
then
  echo "ATR Finder Changing Small is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChangingSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChangingSmall2.js > /dev/null
then
  echo "ATR Finder Changing Small 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChangingSmall2.js >> ../Error.log 2>&1
fi