// Define variables and requires
const helperCheckerATR = require('./Helpers/CheckerATR')
const helperCheckerBTC = require('./Helpers/CheckerBTC')

// Log all the finder results
const getResults = async () => {
    // All the BTC collections
    const collectionsBTC = [
        'BTCFinder', 'BTCFinder2', 'BTCFinderSmall', 'BTCFinderSmall2',
        'BTCFinderReverse', 'BTCFinderReverse2', 'BTCFinderReverseSmall', 'BTCFinderReverseSmall2',
        'BTCFinderChanging', 'BTCFinderChanging2', 'BTCFinderChangingSmall', 'BTCFinderChangingSmall2',
        'BTCFinderChanging2Loss', 'BTCFinderChanging2Loss2', 'BTCFinderChanging2LossSmall', 'BTCFinderChanging2LossSmall2'
    ]

    // Loop all BTC collections and print there results
    for (let i = 0; i < collectionsBTC.length; i++) {
        const BTCFinderResults = await helperCheckerBTC.checkBTCFinders(collectionsBTC[i])
        console.log(`${collectionsBTC[i]} - ${BTCFinderResults.result}`)
    }

    // All the ATR collections
    const collectionsATR = ['ATRFinder', 'ATRFinderSmall']

    // Loop all ATR collections and print there results
    for (let i = 0; i < collectionsATR.length; i++) {
        const ATRFinderResults = await helperCheckerATR.checkATRFinders(collectionsATR[i])
        console.log(`${collectionsATR[i]} - ${ATRFinderResults.result}`)
    }
}
getResults()