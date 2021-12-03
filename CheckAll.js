// Define variables and requires
const helperCheckerATRSpecial = require('./Helpers/CheckerATRSpecial')
const helperCheckerATR = require('./Helpers/CheckerATR')
const helperCheckerBTC = require('./Helpers/CheckerBTC')

// Log all the finder results
const getResults = async () => {
    // All the BTC collections
    const collectionsBTC = [
        'BTCFinder', 'BTCFinder2', 'BTCFinderReverse', 'BTCFinderReverse2', 
        'BTCFinderChanging', 'BTCFinderChanging2', 'BTCFinderChanging2Loss', 'BTCFinderChanging2Loss2',
        'BTCFinderSmall', 'BTCFinderSmall2', 'BTCFinderReverseSmall', 'BTCFinderReverseSmall2', 
        'BTCFinderChangingSmall', 'BTCFinderChangingSmall2', 'BTCFinderChanging2LossSmall', 'BTCFinderChanging2LossSmall2',
    ]

    // Loop all BTC collections and print there results
    for (let i = 0; i < collectionsBTC.length; i++) {
        const BTCFinderResults = await helperCheckerBTC.checkBTCFinders(collectionsBTC[i])
        console.log(`${collectionsBTC[i]} - ${BTCFinderResults.result}`)
    }

    // All the ATR collections
    const collectionsATR = [
        'ATRFinder', 'ATRFinder2', 'ATRFinderReverse', 'ATRFinderReverse2',
        'ATRFinderChanging', 'ATRFinderChanging2', 'ATRFinderChanging2Loss', 'ATRFinderChanging2Loss2',
        'ATRFinderSmall', 'ATRFinderSmall2', 'ATRFinderReverseSmall', 'ATRFinderReverseSmall2',
        'ATRFinderChangingSmall', 'ATRFinderChangingSmall2', 'ATRFinderChanging2LossSmall', 'ATRFinderChanging2LossSmall2'
    ]

    // Loop all ATR collections and print there results
    for (let i = 0; i < collectionsATR.length; i++) {
        const ATRFinderResults = await helperCheckerATR.checkATRFinders(collectionsATR[i])
        console.log(`${collectionsATR[i]} - ${ATRFinderResults.result}`)
    }

    // All the Special ATR collections
    const collectionsATRSpecial = ['ATRFinderSpecial', 'ATRFinderSpecialSmall']

    // Loop all the special ATR collections and print there results
    for (let i = 0; i < collectionsATRSpecial.length; i++) {
        const ATRFinderSpecialResults = await helperCheckerATRSpecial.checkATRFinders(collectionsATRSpecial[i])
        console.log(`${collectionsATRSpecial[i]} - ${ATRFinderSpecialResults.result}`)
    }
}
getResults()