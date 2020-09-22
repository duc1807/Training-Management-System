// Declare the connection to database
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://duc:duc123123@cluster0-l46rb.azure.mongodb.net/ATNCompany?retryWrites=true&w=majority";

let connectionPromises = null

const mongoPromises = () => {
    if(connectionPromises) return connectionPromises

    connectionPromises = new Promise((resolve, reject) => {
        const connection = new MongoClient(uri, {useUnifiedTopology: true})

        if(connection.isConnected())
        {
            return resolve(connection)
        }
        else {
            connection
            .connect()
            .then(() => {
                return resolve(connection.db("ATNCompany"))
            })
            .catch(err => {
                throw(err)
            })
        }
    })
    return connectionPromises
}
module.exports = mongoPromises