const mongoose = require("mongoose");
require("dotenv").congig();

async function conntectDB(){
    try{
        await mongoose.conntect(process.env.DB_URL);
        console.log("db connected successfully")
    }
    catch(err){
        console.log(err);
    }
}

module.exports = conntectDB;