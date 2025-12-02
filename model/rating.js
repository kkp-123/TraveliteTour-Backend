const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    comment: {
        type: String,
        // required: true
    },
    rating: {
        type: Number,
        // required: true,
        min: 1,
        max: 5
    },
    tourid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tour",
        // required: true
    },
    username: {
        type:String,
        // required:true
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        // required:true
    }
}, { timestamps: true });

const Rating = mongoose.model("rating", ratingSchema);
module.exports = Rating;
