// Define variables and requires
const helperGeneral = require('./General')
const helperMongo = require('./Mongo')

// Function to update all the coin prices
const updatePrices = async () => {
    // Get and update all coin prices
    const allPrices = await helperMongo.getCollectionInfo('AllPrices')
    const allPricesNew = await helperGeneral.getAllPrices()
    // Update the DB with new prices
    await helperMongo.updateCollection('AllPrices', allPrices[0]._id, 'allPrices', allPricesNew)
}
updatePrices()