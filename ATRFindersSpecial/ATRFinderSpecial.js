// Define variables and requires
const helperMongo = require('../Helpers/Mongo')

// Function to run the bot
const runATRFinderBot = async () => {
    // Get needed collection info and declare buy price
    const collectionInfoCoins = await helperMongo.getCollectionInfo('ATRFinderSpecial')
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
                    allCoins[i].movement = movement[x].movement
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
            await move('up')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage > 0 && allCoins[i].currentStage < 3 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('shortsUp')
            await move('up')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage > 1 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('shortsDown')
            await move('down')
            allCoins[i].touchLossLine = true
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === 1 && allCoins[i].shortsUp.length >= 1 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
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
            await move('down')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage < 0 && allCoins[i].currentStage > -3 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('longsDown')
            await move('down')
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage < -1 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await buy('longsUp')
            await move('up')
            allCoins[i].touchLossLine = true
        } else if (allCoins[i].normalBuying && allCoins[i].currentStage === -1 && allCoins[i].longsDown.length >= 1 && currentPrice >= (allCoins[i].currentLine + allCoins[i].movement)) {
            await move('up')
        } else if (!allCoins[i].normalBuying && allCoins[i].currentStage <= -3 && currentPrice <= (allCoins[i].currentLine - allCoins[i].movement)) {
            await buy('shortsDown')
            await move('down')
        }
    }
    // Update the DB with new coin results
    await helperMongo.updateCollection('ATRFinderSpecial', collectionInfoCoins[0]._id, 'allCoins', allCoins)

    // NEEDED MONGO VARIABLES
    // allCoins[i].symbol
    // allCoins[i].startingLine
    // allCoins[i].currentLine
    // allCoins[i].normalBuying
    // allCoins[i].movement
    // allCoins[i].firstBought
    // allCoins[i].shortsUp
    // allCoins[i].shortsDown
    // allCoins[i].longsUp
    // allCoins[i].longsDown
    // allCoins[i].touchLossLine
    // allCoins[i].hit0Line
    // allCoins[i].currentStage
    // allCoins[i].wallet
    // allCoins[i].walletOld
    // allCoins[i].wonTimes
    // allCoins[i].lossTimes

    // RULES FOR BUY / SELL AND PSEUDO CODE
    // SHORTS
    // DONE - if currentstage >= 0 and touchLossLine = true and hit0line = false and currentPrice >= (currentLine + movement) THEN sell all and start over
    // DONE - if currentStage > 3 and current prce <= (currentLine - movement) THEN sell all and start over
    // DONE - if firstbought = up and hit0line = true and currentPrice >= starting line
    // DONE - sell from all shorts loss - if (current stage == 3 and current prce >= (currentLine + movement)) sell all the shorts (dont start over)
    // LONGS
    // DONE - if currentstage <= 0 and touchLossLine = true and hit0line = false and currentPrice <= (currentLine - movement) THEN sell all and start over
    // DONE - if currentStage < -3 and current prce >= (currentLine + movement) THEN sell all and start over
    // DONE - if firstbought = down and hit0line = true and currentPrice <= starting line
    // DONE sell from all longs loss - if (current stage == -3 and current prce <= (currentLine - movement)) sell all the shorts (dont start over)

    // SELL FROM WINNING 3 STEPS RULES
    // SHORTS
    // DONE - if shortsUp.length = 3 and currentPrice <= currentline - (3 x movement) sell it then pop out
    // DONE - if shortsUp.length = 2 && shortsDown.length = 2 at first long sell shortsUp[1] and shortsDown[1] then pop both out
    // DONE - if shortsUp.length = 2 && shortsDown.length = 1 at first long sell shortsUp[0] then pop out
    // DONE - if shortsUp.length = 1 && shortsDown.length = 1 at first long sell shortsUp[0] and shortsDown[0] then pop both out
    // DONE - if shortsUp.length = 1 && shortsDown.length = 0 at first long sell shortsUp[0] then pop out
    // LONGS
    // DONE - if longsDown.length = 3 at zero line sell longsDown[2] then pop out
    // DONE - if longsDown.length = 2 && longsUp.length = 2 at first long sell longsDown[1] and longsUp[1] then pop both out
    // DONE - if longsDown.length = 2 && longsUp.length = 1 at first long sell longsDown[0] then pop out
    // DONE - if longsDown.length = 1 && longsUp.length = 1 at first long sell longsDown[0] and longsUp[0] then pop both out
    // DONE - if longsDown.length = 1 && longsUp.length = 0 at first long sell longsDown[0] then pop out

    // BUYING RULES
    // SHORTS
    // DONE - if currentStage = 0 and first bought = none and current prce >= (currentLine + movement) THEN short and adjust current stage to current stage + 1 and current line to currentLine + movement and set firstbought = up
    // DONE - if currentstage = 0 and first bought = down and current prce >= (currentLine + movement) THEN short and adjust current stage to current stage + 1 and current line to currentLine + movement and set hit0line to true and touchlossline to false
    // DONE - if currentstage = 0 and first bought = up and current prce >= (currentLine + movement) THEN adjust current stage to current stage + 1 and current line to currentLine + movement
    // DONE - if currentStage > 0 and < 3 and current prce >= (currentLine + movement) THEN short and adjust current stage to current stage + 1 and current line to currentLine + movement 
    // DONE - if currentStage > 1 and current prce <= (currentLine - movement) THEN short and adjust current stage to current stage - 1 and current line to currentLine - movement and touchLossLine = true
    // DONE - if currentStage == 1 and shortsUp.length > 1 and current prce <= (currentLine - movement) THEN adjust current stage to 0 and current line to currentLine - movement
    // DONE - if currentStage >= 3 and current prce >= (currentLine + movement) THEN long and adjust current stage to current stage + 1 and current line to currentLine + movement
    // LONGS
    // DONE - if currentStage = 0 and first bought = none and current prce <= (currentLine - movement) THEN long and adjust current stage to current stage - 1 and current line to currentLine - movement and set firstbought = down
    // DONE - if currentstage = 0 and first bought = up and current prce <= (currentLine - movement) THEN long and adjust current stage to current stage - 1 and current line to currentLine - movement and set hit0line to true and touchlossline to false
    // DONE - if currentstage = 0 and first bought = down and current prce <= (currentLine - movement) THEN adjust current stage to current stage - 1 and current line to currentLine - movement
    // DONE - if currentStage < 0 and > -3 and current prce <= (currentLine - movement) THEN long and adjust current stage to current stage - 1 and current line to currentLine - movement 
    // DONE - if currentStage < -1 and current prce >= (currentLine + movement) THEN long and adjust current stage to current stage + 1 and current line to currentLine + movement and touchLossLine = true
    // DONE - if currentStage == -1 and longsDown.length > 1 and current prce >= (currentLine + movement) THEN adjust current stage to 0 and current line to currentLine + movement
    // DONE - §if currentStage <= -3 and current prce <= (currentLine - movement) THEN short and adjust current stage to current stage - 1 and current line to currentLine - movement
}
runATRFinderBot()