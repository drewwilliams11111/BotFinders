#!/bin/bash
if ps -aux | grep -v grep | grep ATRFinderReverse.js > /dev/null
then
  echo "ATR Finder Reverse is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderReverse.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderReverse2.js > /dev/null
then
  echo "ATR Finder Reverse 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderReverse2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderReverseSmall.js > /dev/null
then
  echo "ATR Finder Reverse Small is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderReverseSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderReverseSmall2.js > /dev/null
then
  echo "ATR Finder Reverse Small 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderReverseSmall2.js >> ../Error.log 2>&1
fi