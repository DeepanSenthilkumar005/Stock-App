const mongoose = require('mongoose');

async function ConnectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        .then(console.log("MongoDB Connected"))
    }
    catch
    {
        console.error("Error in connecting the DB");
        
    }
}
module.exports = ConnectDB;