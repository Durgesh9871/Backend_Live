const mongoose = require("mongoose") 
require("dotenv").config()
// mongodb+srv://:@cluster0.lwsu6dg.mongodb.net/?retryWrites=true&w=majority

const connection = mongoose.connect(process.env.mongo_url)


module.exports = {
    connection
}
