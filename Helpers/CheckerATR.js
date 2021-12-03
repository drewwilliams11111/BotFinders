// Define variables and requires
const helperMongo = require('./Mongo')

module.exports = class HelperCheckerATR {
    // Use collection name to build a table of results of all coins and overall results
    static checkATRFinders = async (collectionName) => {
        const allCoinsCollection = await helperMongo.getCollectionInfo(collectionName)
        const allCoins = allCoinsCollection[0].allCoins
        const getAllPrices = await helperMongo.getCollectionInfo('AllPrices')
        const allPrices = getAllPrices[0].allPrices
        let finalTable = []
        let totalWallet = 0

        // Loop through all coins to add individual and overall results
        for (let i = 0; i < allCoins.length; i++) {
            const currentSymbol = allCoins[i].symbol
            const currentPrice = Number(allPrices[currentSymbol])
            let totalPrice = allCoins[i].wallet
            if (allCoins[i].boughtOrNot && allCoins[i].boughtType === 'long') {
                const percentage = (Math.abs(allCoins[i].boughtPrice - currentPrice) / allCoins[i].boughtPrice)
                totalPrice = (currentPrice > allCoins[i].boughtPrice) ? allCoins[i].walletOld + (allCoins[i].walletOld * percentage) : allCoins[i].walletOld - (allCoins[i].walletOld * percentage)
            } else if (allCoins[i].boughtOrNot && allCoins[i].boughtType === 'short') {
                const percentage = (Math.abs(allCoins[i].boughtPrice - currentPrice) / allCoins[i].boughtPrice)
                totalPrice = (allCoins[i].boughtPrice > currentPrice) ? allCoins[i].walletOld + (allCoins[i].walletOld * percentage) : allCoins[i].walletOld - (allCoins[i].walletOld * percentage)
            }
            finalTable.push({
                symbol: currentSymbol,
                wallet: totalPrice.toFixed(2),
                boughtOrNot: allCoins[i].boughtOrNot,
                buyType: allCoins[i].boughtType,
                wonTimes: allCoins[i].wonTimes,
                lossTimes: allCoins[i].lossTimes,
                percent: Number((Math.abs(allCoins[i].wallet - 100) / allCoins[i].wallet).toFixed(2))
            })
            totalWallet += totalPrice
        }
        return {
            table: finalTable,
            result: `$${Number(totalWallet.toFixed(2))} / $${allCoins.length * 100} / ${Number((Math.abs(totalWallet - (allCoins.length * 100)) / totalWallet).toFixed(2))}%`
        }
    }
}