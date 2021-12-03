// Define variables and requires
const helperChecker = require('../Helpers/CheckerATR')

// Log the ATR Finder results
const getResults = async () => {
    const ATRDBS = ['ATRFinderChanging', 'ATRFinderChanging2', 'ATRFinderChangingSmall', 'ATRFinderChangingSmall2'] 
    for (let i = 0; i < ATRDBS.length; i++) {
        const ATRFinderResults = await helperChecker.checkATRFinders(ATRDBS[i])
        console.log(ATRDBS[i])
        console.table(ATRFinderResults.table)
        console.log(ATRFinderResults.result)
    }
}
getResults()