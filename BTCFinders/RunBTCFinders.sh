#!/bin/bash
if ps -aux | grep -v grep | grep BTCFinder.js > /dev/null
then
  echo "BTC Finder is running."
else
  cd /home/ubuntu/BotFinders/BTCFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinder.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinder2.js > /dev/null
then
  echo "BTC Finder 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinder2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderSmall.js > /dev/null
then
  echo "BTC Finder Small is running."
else
  cd /home/ubuntu/BotFinders/BTCFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderSmall2.js > /dev/null
then
  echo "BTC Finder Small 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFinders && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderSmall2.js >> ../Error.log 2>&1
fi