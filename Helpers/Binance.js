// Define variables and requires
const axios = require('axios')
const crypto = require('crypto')
const qs = require('qs')
const helperMongo = require('./Mongo')

// Make encrypted secret key
const buildSign = (data, config) => {
    return crypto.createHmac('sha256', config.API_sec).update(data).digest('hex');
};

// Build an API call to binance
const privateRequest = async (data, endPoint, type) => {
    const infoAPI = await helperMongo.getCollectionInfo('API')

    const binanceConfig = {
        API_KEY: infoAPI[0].key,
        API_sec: infoAPI[0].sec,
        HOST_URL: 'https://api.binance.com',
    }
    const dataQueryString = qs.stringify(data);
    const signature = buildSign(dataQueryString, binanceConfig);
    const requestConfig = {
        method: type,
        url: binanceConfig.HOST_URL + endPoint + '?' + dataQueryString + '&signature=' + signature,
        headers: {
            'X-MBX-APIKEY': binanceConfig.API_KEY,
        },
    }
    try {
        const response = await axios(requestConfig);
        return response
    }
    catch (err) {
        console.log(err.response.config.url)
        console.log(err.response.data.msg)
        return false
    }
}

module.exports = class binanceHelpers {
    // Get all available coins in cross margin
    static getCoinInfoMargin = async () => {
        const data = { timestamp: Date.now() }
        const coinInfoMargin = await privateRequest(data, '/sapi/v1/margin/allPairs', 'GET')
        return !coinInfoMargin ? false : coinInfoMargin.data
    }
}
