// Define variables and requires
const helperMongo = require('./Mongo')

module.exports = class HelperCheckerATR {
    // Use collection name to build a table of results of all coins and overall results
    static checkATRFinders = async (collectionName) => {
        const allCoinsCollection = await helperMongo.getCollectionInfo(collectionName)
        const allCoins = allCoinsCollection[0].allCoins
        const getAllPrices = await helperMongo.getCollectionInfo('AllPrices')
        const allPrices = getAllPrices[0].allPrices
        const buyPrice = 20
        let finalTable = []
        let totalWallet = 0

        // Loop through all coins to add individual and overall results
        for (let i = 0; i < allCoins.length; i++) {
            const currentSymbol = allCoins[i].symbol
            const currentPrice = Number(allPrices[currentSymbol])
            let totalPrice = 0
            let boughtShorts = 0
            let boughtLongs = 0
            let priceToAdd = 0
            const calculateResults = async (buysToCalculate, buyType) => {
                for (let j = 0; j < buysToCalculate.length; j++) {
                    const percentage = (Math.abs(buysToCalculate[j] - currentPrice) / buysToCalculate[j])
                    if (buyType === 'long') priceToAdd = (currentPrice > buysToCalculate[j]) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                    if (buyType === 'short') priceToAdd = (buysToCalculate[j] > currentPrice) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                    totalPrice += priceToAdd
                    boughtShorts++
                }
            }
            await calculateResults(allCoins[i].shortsUp, 'short')
            await calculateResults(allCoins[i].shortsDown, 'short')
            await calculateResults(allCoins[i].longsUp, 'long')
            await calculateResults(allCoins[i].longsDown, 'long')
            allCoins[i].wallet += totalPrice
            finalTable.push({
                symbol: allCoins[i].symbol,
                wallet: allCoins[i].wallet.toFixed(2),
                boughtShorts: boughtShorts,
                boughtLongs: boughtLongs,
                wonTimes: allCoins[i].wonTimes,
                lossTimes: allCoins[i].lossTimes,
                percent: Number((Math.abs(allCoins[i].wallet - 100) / allCoins[i].wallet).toFixed(2))
            })
            totalWallet += allCoins[i].wallet
        }
        return {
            table: finalTable,
            result: `$${Number(totalWallet.toFixed(2))} / $${allCoins.length * 100} / ${Number((Math.abs(totalWallet - (allCoins.length * 100)) / totalWallet).toFixed(2))}%`
        }
    }
}