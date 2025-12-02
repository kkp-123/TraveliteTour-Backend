const mongoose = require("mongoose");

// define the person schema

const bookingSchema = new mongoose.Schema({
    name:{
        type:String
    },
    title:{
        type :String,
    
    },
    contactno: {
        type : String,
    },
    email: {
        type: String,
        
    },
    departure_date:{
        type:Date
    },
    persons:{
        type:Number
    },
    price : {
        type : String
    },
    created_at : {
        type : Date,
        default:Date.now()
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tourid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Tour"
    }
    
});

// create person model

const Booking = mongoose.model('Booking',bookingSchema);
module.exports = Booking;