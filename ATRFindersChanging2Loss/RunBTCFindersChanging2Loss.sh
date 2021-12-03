#!/bin/bash
if ps -aux | grep -v grep | grep ATRFinderChanging2Loss.js > /dev/null
then
  echo "ATR Finder Changing 2 loss is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging2Loss && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging2Loss.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChanging2Loss2.js > /dev/null
then
  echo "ATR Finder Changing 2 loss 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging2Loss && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging2Loss2.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChanging2LossSmall.js > /dev/null
then
  echo "ATR Finder Changing 2 loss Small is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging2Loss && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging2LossSmall.js >> ../Error.log 2>&1
fi

if ps -aux | grep -v grep | grep ATRFinderChanging2LossSmall2.js > /dev/null
then
  echo "ATR Finder Changing 2 loss Small 2 is running."
else
  cd /home/ubuntu/BotFinders/ATRFindersChanging2Loss && /home/ubuntu/.nvm/versions/node/v17.1.0/bin/node ATRFinderChanging2LossSmall2.js >> ../Error.log 2>&1
fi