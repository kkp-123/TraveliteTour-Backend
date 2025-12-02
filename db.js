const mongoose = require('mongoose');

require('dotenv').config();

const dburl = process.env.DB_URL

mongoose.connect(dburl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('connected' , () => {
    console.log("Connected sucessfully")
})
db.on('error' , (err) => {
    console.log("mongodb connection error",err)
})
db.on('disconnected' , () => {
    console.log("mongodb disconnected")
})

module.exports = {
    db
};
