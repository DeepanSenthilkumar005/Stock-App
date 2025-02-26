const mongoose = require('mongoose')
const listSchema = new mongoose.Schema({
    category: {
        type : String,
        required : [true,"Enter the Category"]
    },
    types: String,
    quantity: Number,
})

module.exports = mongoose.model("List",listSchema)