// Define variables and requires
const helperMongo = require('../Helpers/Mongo')

// Function to run the bot
const runATRFinderBot = async () => {
    // Get needed collection info and declare buy price
    const collectionInfoCoins = await helperMongo.getCollectionInfo('ATRFinderSmall')
    let allCoins = collectionInfoCoins[0].allCoins
    const collectionInfoPrices = await helperMongo.getCollectionInfo('AllPrices')
    const allPrices = collectionInfoPrices[0].allPrices
    const buyPrice = 20

    // Run algorithm on all coins
    for (let i = 0; i < allCoins.length; i++) {
        const currentSymbol = allCoins[i].symbol
        const currentPrice = Number(allPrices[currentSymbol])

        // Update ATR movement after selling all
        const getNewMovement = async () => {
            const collectionInfoMovement = await helperMongo.getCollectionInfo('Movements')
            const movement = collectionInfoMovement[0].movements
            for (let x = 0; x < movement.length; x++) {
                if (movement[x].symbol === currentSymbol) {
                    allCoins[i].movement = movement[x].movementSmall
                    return
                }
            }
        }

        // Move the current stage and update the current line
        const move = async (direction) => {
            if (direction === 'up') {
                allCoins[i].currentStage++
                allCoins[i].currentLine += allCoins[i].movement
            } else {
                allCoins[i].currentStage--
                allCoins[i].currentLine -= allCoins[i].movement
            }
        }

        // Perform fake buy and update wallet
        const buy = async (buyType) => {
            if (buyType === 'shortsUp') {
                allCoins[i].shortsUp.push(currentPrice)
            } else if (buyType === 'shortsDown') {
                allCoins[i].shortsDown.push(currentPrice)
            } else if (buyType === 'longsUp') {
                allCoins[i].longsUp.push(currentPrice)
            } else if (buyType === 'longsDown') {
                allCoins[i].longsDown.push(currentPrice)
            }
            allCoins[i].wallet -= buyPrice
        }

        // Perform fake sell and update wallet (not all just a small amount)
        const sell = async (sellType) => {
            let priceToAdd = 0
            if (sellType === 'shortsUp') {
                const percentage = (Math.abs(allCoins[i].shortsUp[allCoins[i].shortsUp.length - 1] - currentPrice) / allCoins[i].shortsUp[allCoins[i].shortsUp.length - 1])
                priceToAdd = (allCoins[i].shortsUp[allCoins[i].shortsUp.length - 1] > currentPrice) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
            } else if (sellType === 'shortsDown') {
                const percentage = (Math.abs(allCoins[i].shortsDown[allCoins[i].shortsDown.length - 1] - currentPrice) / allCoins[i].shortsDown[allCoins[i].shortsDown.length - 1])
                priceToAdd = (allCoins[i].shortsDown[allCoins[i].shortsDown.length - 1] > currentPrice) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
            } else if (sellType === 'longsUp') {
                const percentage = (Math.abs(allCoins[i].longsUp[allCoins[i].longsUp.length - 1] - currentPrice) / allCoins[i].longsUp[allCoins[i].longsUp.length - 1])
                priceToAdd = (currentPrice > allCoins[i].longsUp[allCoins[i].longsUp.length - 1]) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
            } else if (sellType === 'longsDown') {
                const percentage = (Math.abs(allCoins[i].longsDown[allCoins[i].longsDown.length - 1] - currentPrice) / allCoins[i].longsDown[allCoins[i].longsDown.length - 1])
                priceToAdd = (currentPrice > allCoins[i].longsDown[allCoins[i].longsDown.length - 1]) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
            }
            allCoins[i].wallet += priceToAdd
        }

        // Perform fake sell and update wallet and all other coin params
        const sellAll = async (resetLines) => {
            let totalPrice = 0
            for (let j = 0; j < allCoins[i].shortsUp.length; j++) {
                const percentage = (Math.abs(allCoins[i].shortsUp[j] - currentPrice) / allCoins[i].shortsUp[j])
                const priceToAdd = (allCoins[i].shortsUp[j] > currentPrice) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                totalPrice += priceToAdd
            }
            for (let j = 0; j < allCoins[i].shortsDown.length; j++) {
                const percentage = (Math.abs(allCoins[i].shortsDown[j] - currentPrice) / allCoins[i].shortsDown[j])
                const priceToAdd = (allCoins[i].shortsDown[j] > currentPrice) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                totalPrice += priceToAdd
            }
            for (let j = 0; j < allCoins[i].longsUp.length; j++) {
                const percentage = (Math.abs(allCoins[i].longsUp[j] - currentPrice) / allCoins[i].longsUp[j])
                const priceToAdd = (currentPrice > allCoins[i].longsUp[j]) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                totalPrice += priceToAdd
            }
            for (let j = 0; j < allCoins[i].longsDown.length; j++) {
                const percentage = (Math.abs(allCoins[i].longsDown[j] - currentPrice) / allCoins[i].longsDown[j])
                const priceToAdd = (currentPrice > allCoins[i].longsDown[j]) ? buyPrice + (buyPrice * percentage) : buyPrice - (buyPrice * percentage)
                totalPrice += priceToAdd
            }
            allCoins[i].wallet += totalPrice
            allCoins[i].shortsUp = []
            allCoins[i].shortsDown = []
            allCoins[i].longsUp = []
            allCoins[i].longsDown = []
            if (resetLines) {
                if (allCoins[i].wallet > allCoins[i].walletOld) {
                    allCoins[i].wonTimes++
                } else {
                    allCoins[i].lossTimes++
                }
                allCoins[i].normalBuying = true
                allCoins[i].firstBought = 'none'
                allCoins[i].touchLossLine = false
                allCoins[i].hit0Line = false
                allCoins[i].currentStage = 0
                allCoins[i].startingLine = currentPrice
                allCoins[i].currentLine = currentPrice
                await getNewMovement()
            }
        }

        // SHORTS sell all and start over
        if (allCoins[i].normalBuying && allCoins[i].currentStage >= 0 && allCoins[i].touchLossLine && !allCoins[i].hit0Line && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await sellAll(true)
        } else if (!allCoins[i].normalBuying && allCoins[i].currentStage > 3 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await sellAll(true)
        } else if (allCoins[i].normalBuying && allCoins[i].firstBought === 'up' && allCoins[i].hit0Line && currentPrice >= allCoins[i].startingLine) {
            await sellAll(true)
        }

        // LONGS sell all and start over
        else if (allCoins[i].normalBuying && allCoins[i].currentStage <= 0 && allCoins[i].touchLossLine && !allCoins[i].hit0Line && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await sellAll(true)
        } else if (!allCoins[i].normalBuying && allCoins[i].currentStage < -3 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await sellAll(true)
        } else if (allCoins[i].normalBuying && allCoins[i].firstBought === 'down' && allCoins[i].hit0Line && currentPrice <= allCoins[i].startingLine) {
            await sellAll(true)
        }

        // SHORTS sell all but dont start over
        else if (allCoins[i].normalBuying && allCoins[i].currentStage === 3 && currentPrice > (allCoins[i].currentLine + allCoins[i].movement)) {
            await sellAll(false)
            await move('up')
            allCoins[i].normalBuying = false
        }
        // LONGS sell all but dont start over
        else if (allCoins[i].normalBuying && allCoins[i].currentStage === -3 && currentPrice < (allCoins[i].currentLine - allCoins[i].movement)) {
            await sellAll(false)
            await move('down')
            allCoins[i].normalBuying = false
        }

        // SHORTS sell from win 3 steps
        else if (allCoins[i].normalBuying && allCoins[i].shortsUp.length === 3 && currentPrice <= allCoins[i].startingLine) {
            await sell('shortsUp')
            allCoins[i].shortsUp.pop()
        } else if (allCoins[i].normalBuying && allCoins[i].shortsUp.length === 2 && currentPrice <= (allCoins[i].startingLine - allCoins[i].movement)) {
            await sell('shortsUp')
            allCoins[i].shortsUp.pop()
            if (allCoins[i].shortsDown.length === 2) {
                await sell('shortsDown')
                allCoins[i].shortsDown.pop()
            }
        } else if (allCoins[i].normalBuying && allCoins[i].shortsUp.length === 1 && currentPrice <= (allCoins[i].startingLine - (2 * allCoins[i].movement))) {
            await sell('shortsUp')
            allCoins[i].shortsUp.pop()
            if (allCoins[i].shortsDown.length === 1) {
                await sell('shortsDown')
                allCoins[i].shortsDown.pop()
            }
        }

        // LONGS sell from win 3 steps
        else if (allCoins[i].normalBuying && allCoins[i].longsDown.length === 3 && currentPrice >= allCoins[i].startingLine) {
            await sell('longsDown')
            allCoins[i].longsDown.pop()
        } else if (allCoins[i].normalBuying && allCoins[i].longsDown.length === 2 && currentPrice >= (allCoins[i].startingLine + allCoins[i].movement)) {
            await sell('longsDown')
            allCoins[i].longsDown.pop()
            if (allCoins[i].longsUp.length === 2) {
                await sell('longsUp')
                allCoins[i].longsUp.pop()
            }
        } else if (allCoins[i].normalBuying && allCoins[i].longsDown.length === 1 && currentPrice >= (allCoins[i].startingLine + (2 * allCoins[i].movement))) {
            await sell('longsDown')
            allCoins[i].longsDown.pop()
            if (allCoins[i].longsUp.length === 1) {
                await sell('longsUp')
                allCoins[i].longsUp.pop()
            }
        }

        // SHORTS buying rules
        else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'none' && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('shortsUp')
            await move('up')
            allCoins[i].firstBought = 'up'
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'down' && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('shortsUp')
            await move('up')
            allCoins[i].hit0Line = true
            allCoins[i].touchLossLine = false
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'up' && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            // dont buy here
            await move('up')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage > 0 && allCoins[i].currentStage < 3 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('shortsUp')
            await move('up')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage > 1 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('shortsDown')
            await move('down')
            allCoins[i].touchLossLine = true
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 1 && allCoins[i].shortsUp.length >= 1 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            // dont buy here
            await move('down')
        } else if (!allCoins[i].normalBuying && allCoins[i].currentStage >= 3 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('longsUp')
            await move('up')
        }

        // LONGS buying rules
        else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'none' && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('longsDown')
            await move('down')
            allCoins[i].firstBought = 'down'
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'up' && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('longsDown')
            await move('down')
            allCoins[i].hit0Line = true
            allCoins[i].touchLossLine = false
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 0 && allCoins[i].firstBought === 'down' && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            // dont buy here
            await move('down')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage < 0 && allCoins[i].currentStage > -3 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('longsDown')
            await move('down')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage < -1 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('longsUp')
            await move('up')
            allCoins[i].touchLossLine = true
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === -1 && allCoins[i].longsDown.length >= 1 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            // dont buy here
            await move('up')
        } else if (!allCoins[i].normalBuying && allCoins[i].currentStage <= -3 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('shortsDown')
            await move('down')
        }
    }
    // Update the DB with new coin results
    await helperMongo.updateCollection('ATRFinderSmall', collectionInfoCoins[0]._id, 'allCoins', allCoins)
}
runATRFinderBot()

