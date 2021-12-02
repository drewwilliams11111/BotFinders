#!/bin/bash
if ps -aux | grep -v grep | grep BTCFinderReverse.js > /dev/null
then
  echo "BTC Finder Reverse is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderReverse.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderReverse2.js > /dev/null
then
  echo "BTC Finder Reverse 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderReverse2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderReverseSmall.js > /dev/null
then
  echo "BTC Finder Reverse Small is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderReverseSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderReverseSmall2.js > /dev/null
then
  echo "BTC Finder Reverse Small 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersReverse && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderReverseSmall2.js >> ../Error.log 2>&1
fi