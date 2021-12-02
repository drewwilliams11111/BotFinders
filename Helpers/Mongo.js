// Define variables and requires
const mongoClient = require('mongodb').MongoClient
let url = "mongodb://localhost:27017"

// Export Mongo functions
module.exports = class MongoHelper {
    // Create a database
    static createDatabase = async (databaseName) => {
        mongoClient.connect(`${url}/${databaseName}`, function (err, db) {
            console.log(err ? err : `Successfully created ${databaseName} database`)
            db.close()
        })
    }
    // Create a collection
    static createCollection = async (collectionName) => {
        mongoClient.connect(url, function (err, db) {
            if (err) { throw err } else {
                db.db('BotFinders').createCollection(collectionName, function (err) {
                    console.log(err ? err : `Successfully created ${collectionName} collection`)
                    db.close()
                })
            }
        })
    }
    // Return collection info
    static getCollectionInfo = async (collectionName) => {
        const db = await mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        const result = await db.db('BotFinders').collection(collectionName).find().toArray()
        db.close()
        return result
    }
    // Add a new object to the collection
    static addNewCollectionObject = async (collectionName, collectionDataObject) => {
        const db = await mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        await db.db('BotFinders').collection(collectionName).insertOne(collectionDataObject)
        db.close()
    }
    // Update a collection
    static updateCollection = async (collectionName, id, field, newValue) => {
        const db = await mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        const myquery = { _id: id }
        const newValues = { $set: { [field]: newValue } }
        await db.db('BotFinders').collection(collectionName).updateOne(myquery, newValues)
        db.close()
    }
}