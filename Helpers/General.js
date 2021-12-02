// Define variables and requires
const Binance = require("binance-api-node").default
const helperMongo = require('./Mongo')
const helperBinance = require('./Binance')

// Get needed API info
const getAPIInfo = async () => {
    const infoAPI = await helperMongo.getCollectionInfo('API')
    return Binance({
        apiKey: infoAPI[0].key,
        apiSecret: infoAPI[0].sec
    })
}

module.exports = class Helper {
    // Get all the coins available in cross margin
    static getCoinInfoMargin = async () => {
        const coinInfo = await helperBinance.getCoinInfoMargin()
        return coinInfo
    }
    // Get all the prices for every coin available
    static getAllPrices = async () => {
        const client = await getAPIInfo()
        return await client.prices()
    }
    // Get current price of a specific coin
    static getCurrentPrice = async (symbol) => {
        const client = await getAPIInfo()
        const symbolData = await client.candles({
            symbol: symbol,
            interval: '1m',
            limit: "1",
        });
        return Number(symbolData[0].close)
    }
    // Get the last 14 candles with a 4 hour interval
    static getCandles = async (symbol) => {
        const client = await getAPIInfo()
        const symbolData = await client.candles({
            symbol: symbol,
            interval: '4h',
            limit: "15",
        });
        symbolData.pop()
        return symbolData
    }
    // Add a line and write to a log file
    static addToFile = async (path, textToLog) => {
        fs.writeFileSync(path, `\n${textToLog}`, { flag: 'a' })
    }
}