const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const Booking = require('../model/booking');

router.use(bodyparser.json());


router.post('/BookingTour', async function (req, res) {

    // email: email,name:fullName,title:title,contactno:phone,departure_date:date,persons:guests,price:total

    try {
        const { email, name, title, contactno, departure_date, persons, price,userid,tourid } = req.body;
        // console.log(userid,tourid);
        const book = new Booking({ email, name, title, contactno, departure_date, persons, price,userid,tourid });
        await book.save();
        res.status(201).json({
            message: "Tour Booked successfully!",
            booking: book,
            success: true
        });
    } catch (err) {
        console.error("Error booking Tour:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }


})


module.exports = router;