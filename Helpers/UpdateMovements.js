// Define variables and requires
const helperGeneral = require('./General')
const helperMongo = require('./Mongo')

// Function to update all the movements
const updateMovements = async () => {

    // Declare movement variables to be used later
    const getAllMovements = await helperMongo.getCollectionInfo('Movements')
    const allMovements = getAllMovements[0].movements
    let movements = []

    // Function to get median for a coin
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
    for (let i = 0; i < allMovements.length; i++) { movements.push(await findMedianRange(allMovements[i].symbol)) }
    // Update the DB with new movements
    await helperMongo.updateCollection('Movements', getAllMovements[0]._id, 'movements', movements)
}
updateMovements()