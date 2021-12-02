// Define variables and requires
const helperMongo = require('./Mongo')
const helperGeneral = require('./General')
const key = 'Put your binance API key here'
const sec = 'Put your binance API secret here'

// Create all DB's and collections
const createDBAndCollection = async () => {

    // Name of all the wanted collections
    const collectionNames = [
        'API', 'AllPrices', 'Movements',
        'ATRFinder', 'ATRFinderSmall',
        'BTCFinder', 'BTCFinder2', 'BTCFinderReverse', 'BTCFinderReverse2', 'BTCFinderChanging', 'BTCFinderChanging2', 'BTCFinderChanging2Loss', 'BTCFinderChanging2Loss2',
        'BTCFinderSmall', 'BTCFinderSmall2', 'BTCFinderReverseSmall', 'BTCFinderReverseSmall2', 'BTCFinderChangingSmall', 'BTCFinderChangingSmall2', 'BTCFinderChanging2LossSmall', 'BTCFinderChanging2LossSmall2',
    ]

    // Create the database
    await helperMongo.createDatabase('BotFinders')

    // Create all the collections
    for (let i = 0; i < collectionNames.length; i++) { await helperMongo.createCollection(collectionNames[i]) }

    // Save API keys so other files can use
    await helperMongo.addNewCollectionObject('API', { key: key, sec: sec })

    // Get prices and declare vars
    const allPrices = await helperGeneral.getAllPrices()
    const allCoinInfo = await helperGeneral.getCoinInfoMargin()
    let ATRFinderObjectAll = []
    let ATRFinderSmallObjectAll = []
    let BTCFinderObjectAll = []
    let BTCFinderSmallObjectAll = []
    let movements = []

    // Create all prices collection
    await helperMongo.addNewCollectionObject('AllPrices', { allPrices: allPrices })

    // Get median for a coin
    async function findMedianRange(symbol) {
        const candles = await helperGeneral.getCandles(symbol)
        const lows = candles.map((candle) => Number(candle.low))
        const highs = candles.map((candle) => Number(candle.high))
        const opens = candles.map((candle) => Number(candle.open))
        const closes = candles.map((candle) => Number(candle.close))
        let priceMovement = 0
        let priceMovementSmall = 0
        for (let x = 0; x < lows.length; x++) {
            priceMovement += highs[x] - lows[x]
            priceMovementSmall += Math.abs(closes[x] - opens[x])
        }
        return {
            symbol: symbol,
            movement: priceMovement / lows.length,
            movementSmall: priceMovementSmall / lows.length
        }
    }

    // Get BTC movement
    const movementBTC = await findMedianRange('BTCUSDT')

    // Create objects for ATR, ATRSmall, BTC, BTCSmall and movements
    for (let i = 0; i < allCoinInfo.length; i++) {
        const currentSymbol = allCoinInfo[i].symbol
        if (currentSymbol.includes("USDT") && currentSymbol !== 'USDCUSDT') {
            const medianRange = await findMedianRange(currentSymbol)
            const currentPrice = Number(allPrices[currentSymbol])
            ATRFinderObjectAll.push({
                symbol: currentSymbol,
                startingLine: currentPrice,
                currentLine: currentPrice,
                movement: medianRange.movement,
                normalBuying: true,
                firstBought: 'none',
                shortsUp: [],
                shortsDown: [],
                longsUp: [],
                longsDown: [],
                touchLossLine: false,
                hit0Line: false,
                currentStage: 0,
                wallet: 100,
                walletOld: 100,
                wonTimes: 0,
                lossTimes: 0
            })
            ATRFinderSmallObjectAll.push({
                symbol: currentSymbol,
                startingLine: currentPrice,
                currentLine: currentPrice,
                movement: medianRange.movementSmall,
                normalBuying: true,
                firstBought: 'none',
                shortsUp: [],
                shortsDown: [],
                longsUp: [],
                longsDown: [],
                touchLossLine: false,
                hit0Line: false,
                currentStage: 0,
                wallet: 100,
                walletOld: 100,
                wonTimes: 0,
                lossTimes: 0
            })
            movements.push(medianRange)
            for (let j = 0; j < allCoinInfo.length; j++) {
                if (currentSymbol.replace('USDT', 'BTC') === allCoinInfo[j].symbol) {
                    BTCFinderObjectAll.push({
                        symbol: currentSymbol,
                        symbolBTC: currentSymbol.replace('USDT', 'BTC'),
                        startingLine: currentPrice,
                        currentLine: currentPrice,
                        currentStage: 0,
                        movement: medianRange.movement,
                        startingLineBTC: Number(allPrices['BTCUSDT']),
                        currentLineBTC: Number(allPrices['BTCUSDT']),
                        currentStageBTC: 0,
                        movementBTC: movementBTC.movement,
                        normalBuying: true,
                        lossTimesInRow: 0,
                        highestPoints: 0,
                        boughtOrNot: false,
                        boughtType: '',
                        boughtPrice: 0,
                        wallet: 100,
                        walletOld: 100,
                        wonTimes: 0,
                        lossTimes: 0
                    })
                    BTCFinderSmallObjectAll.push({
                        symbol: currentSymbol,
                        symbolBTC: currentSymbol.replace('USDT', 'BTC'),
                        startingLine: currentPrice,
                        currentLine: currentPrice,
                        currentStage: 0,
                        movement: medianRange.movementSmall,
                        startingLineBTC: Number(allPrices['BTCUSDT']),
                        currentLineBTC: Number(allPrices['BTCUSDT']),
                        currentStageBTC: 0,
                        movementBTC: movementBTC.movementSmall,
                        normalBuying: true,
                        lossTimesInRow: 0,
                        highestPoints: 0,
                        boughtOrNot: false,
                        boughtType: '',
                        boughtPrice: 0,
                        wallet: 100,
                        walletOld: 100,
                        wonTimes: 0,
                        lossTimes: 0
                    })
                }
            }
        }
    }

    // Create the collections with objects created in last step
    await helperMongo.addNewCollectionObject('ATRFinder', { allCoins: ATRFinderObjectAll })
    await helperMongo.addNewCollectionObject('ATRFinderSmall', { allCoins: ATRFinderSmallObjectAll })
    await helperMongo.addNewCollectionObject('Movements', { movements: movements })
    for (let i = 5; i < 13; i++) { await helperMongo.addNewCollectionObject(collectionNames[i], { allCoins: BTCFinderObjectAll }) }
    for (let i = 13; i < collectionNames.length; i++) { await helperMongo.addNewCollectionObject(collectionNames[i], { allCoins: BTCFinderSmallObjectAll }) }
}
createDBAndCollection()