// Define variables and requires
const helperChecker = require('../Helpers/CheckerBTC')

// Log the BTC finder results
const getResults = async () => {
    const BTCDBS = ['BTCFinderReverse', 'BTCFinderReverse2', 'BTCFinderReverseSmall', 'BTCFinderReverseSmall2'] 
    for (let i = 0; i < BTCDBS.length; i++) {
        const BTCFinderResults = await helperChecker.checkBTCFinders(BTCDBS[i])
        console.log(BTCDBS[i])
        console.table(BTCFinderResults.table)
        console.log(BTCFinderResults.result)
    }
}
getResults()