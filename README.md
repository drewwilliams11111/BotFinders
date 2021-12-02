# Bot Finders

Collection of 20 different algorithms to live test the crypto market.  There are 5 main algorithms and each algorithm has 4 varieties with small parameter changes.  The algorithms are heavily based on ATR type movements.

## Requirements

 1. Install node js.
 2. Install mongo.
 3. Binance account with API credentials.

## Instructions

 1. Download the project.
 2. Run "npm i" in the root directory to install all necessary dependencies. 
 3. Go to Helpers folder and add your Binance API key and secret to the file called CreateDBAndCollection.js (key and sec variables located on top of file)
 4. Run "node CreateDBAndCollection.js" (this will use mongo to create necessary databases, collections and preliminary collection info)
 5. Go to file named cron.txt, copy all cron jobs and add to your local crontab.

## Whats happening?

1. Creation of DB named "BotFinders".
2. Collections are added to BotFinders Database: 
	- **API** - API information.
	- **AllPrices** - Price for every existent coin in Binance.
	- **Movements** - ATR For all coins.
		- Movement is calculated by getting the last 14 candles (4 hour candles) take the high - low of each candle, add them all up then divide by 14.
		- Movement Small is calculated by getting the last 14 candles (4 hour candles) take the absolute value of open - close of each candle, add them all up then divide by 14.
	- Create a collection for every algorithm that can run, total of 20 collections.
3. Every 3 seconds the AllPrices collection is updated.
4. Every 4 hours the Movements collection is updated.
5. All algorithms use AllPrices collection to get prices (used to limit API calls to Binance).
6. All algorithm bots run every 5 seconds

## What are the algorithms doing?
The algorithms are based on longing or shorting after 1 or 2 ATR movements happen.  For more specifics / explanations of exactly how the bot works please refer to the code or message me.

## How to check the results
**Quick overall results:**
 1. Run "node CheckAll.js" in the root directory

**Individual specific results:**

1. cd to one of the 5 main algorithm folders:
	- ATRFinders
	- BTCFinders
	- BTCFindersChanging
	- BTCFindersChanging2Loss
	- BTCFindersReverse
2. Run "node Checker.js" to get results for every bot inside the folder (Includes a table with results of every coin and an overall result for the bot).
