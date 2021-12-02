#!/bin/bash
if ps -aux | grep -v grep | grep BTCFinderChanging.js > /dev/null
then
  echo "BTC Finder Changing is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderChanging.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderChanging2.js > /dev/null
then
  echo "BTC Finder Changing 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderChanging2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderChangingSmall.js > /dev/null
then
  echo "BTC Finder Changing Small is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderChangingSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep BTCFinderChangingSmall2.js > /dev/null
then
  echo "BTC Finder Changing Small 2 is running."
else
  cd /home/ubuntu/BotFinders/BTCFindersChanging && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node BTCFinderChangingSmall2.js >> ../Error.log 2>&1
fi