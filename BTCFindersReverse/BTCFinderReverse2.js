// Define variables and requires
const helperMongo = require('../Helpers/Mongo')

// Function to run the bot
const runBTCFinderBot = async () => {
    // Get needed collection info
    const collectionInfoCoins = await helperMongo.getCollectionInfo('BTCFinderReverse2')
    let allCoins = collectionInfoCoins[0].allCoins
    const collectionInfoPrices = await helperMongo.getCollectionInfo('AllPrices')
    const allPrices = collectionInfoPrices[0].allPrices

    // Run algorithm on all coins
    for (let i = 0; i < allCoins.length; i++) {
        const currentSymbol = allCoins[i].symbol
        const currentPrice = Number(allPrices[currentSymbol])
        const currentSymbolBTC = allCoins[i].symbolBTC
        const currentPriceBTC = Number(allPrices['BTCUSDT'])

        // Update ATR movement after selling all
        const getNewMovement = async () => {
            const collectionInfoMovement = await helperMongo.getCollectionInfo('Movements')
            const movement = collectionInfoMovement[0].movements
            for (let x = 0; x < movement.length; x++) {
                if (movement[x].symbol === 'BTCUSDT') {
                    allCoins[i].movementBTC = movement[x].movement
                }
                if (movement[x].symbol === currentSymbol) {
                    allCoins[i].movement = movement[x].movement
                }
            }
        }

        // Move the current stage and update the current line
        const move = async (direction) => {
            if (direction === 'up') {
                allCoins[i].currentStage++
                allCoins[i].currentLine += allCoins[i].movement
            } else {
                allCoins[i].currentStage--
                allCoins[i].currentLine -= allCoins[i].movement
            }
        }

        // Move the current stage and update the current line for BTC
        const moveBTC = async (direction) => {
            if (direction === 'up') {
                allCoins[i].currentStageBTC++
                allCoins[i].currentLineBTC += allCoins[i].movementBTC
            } else {
                allCoins[i].currentStageBTC--
                allCoins[i].currentLineBTC -= allCoins[i].movementBTC
            }
        }

        // Perform fake buy and update wallet
        const buy = async () => {
            if (allCoins[i].currentStage > allCoins[i].currentStageBTC) {
                allCoins[i].boughtType = 'short'
            } else {
                allCoins[i].boughtType = 'long'
            }
            allCoins[i].wallet = 0
            allCoins[i].boughtOrNot = true
            allCoins[i].boughtPrice = Number(allPrices[currentSymbolBTC])
        }

        // Perform fake sell and update wallet and all other coin params
        const sell = async () => {
            const currentPriceCoinBTC = Number(allPrices[currentSymbolBTC])
            const percentage = (Math.abs(allCoins[i].boughtPrice - currentPriceCoinBTC) / allCoins[i].boughtPrice)
            if (allCoins[i].boughtType === 'long') {
                allCoins[i].wallet = (currentPriceCoinBTC > allCoins[i].boughtPrice) ? allCoins[i].walletOld + (allCoins[i].walletOld * percentage) : allCoins[i].walletOld - (allCoins[i].walletOld * percentage)
            } else {
                allCoins[i].wallet = (allCoins[i].boughtPrice > currentPriceCoinBTC) ? allCoins[i].walletOld + (allCoins[i].walletOld * percentage) : allCoins[i].walletOld - (allCoins[i].walletOld * percentage)
            }
            if (allCoins[i].wallet > allCoins[i].walletOld) {
                allCoins[i].wonTimes++
            } else {
                allCoins[i].lossTimes++
            }
            allCoins[i].boughtOrNot = false
            allCoins[i].boughtType = ''
            allCoins[i].startingLine = currentPrice
            allCoins[i].currentLine = currentPrice
            allCoins[i].currentStage = 0
            allCoins[i].startingLineBTC = currentPriceBTC
            allCoins[i].currentLineBTC = currentPriceBTC
            allCoins[i].currentStageBTC = 0
            allCoins[i].walletOld = allCoins[i].wallet
            await getNewMovement()
        }

        // Adjust if moved the correct amount of movement
        if (currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) await move('up')
        if (currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) await move('down')
        if (currentPriceBTC >= (allCoins[i].currentLineBTC + allCoins[i].movementBTC)) await moveBTC('up')
        if (currentPriceBTC <= (allCoins[i].currentLineBTC - allCoins[i].movementBTC)) await moveBTC('down')

        // Find current amount of points in between
        const points = Math.abs(allCoins[i].currentStageBTC - allCoins[i].currentStage)

        // Find out if should buy
        if (!allCoins[i].boughtOrNot && points === 2) {
            await buy()
        }

        // Find out if should sell or update highest points
        if (allCoins[i].boughtOrNot && (points === 0 || points === 4)) {
            await sell()
        }
    }
    // Update the DB with new coin results
    await helperMongo.updateCollection('BTCFinderReverse2', collectionInfoCoins[0]._id, 'allCoins', allCoins)
}
runBTCFinderBot()