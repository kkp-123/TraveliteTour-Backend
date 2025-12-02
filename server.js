const express = require('express');

const app = express();
const db = require('./db');
const { get } = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors())

const port = process.env.PORT;

const userRoutes = require('./routes/UserRoutes')
app.use('/',userRoutes);

const tourRoutes = require("./routes/PackageRoutes")
app.use('/',tourRoutes)

// otp routes
const OtpRoutes = require("./routes/OtpRoutes")
app.use('/',OtpRoutes)


// Booking Routes
const BookingRoutes = require("./routes/BookingRoutes");
app.use('/',BookingRoutes)

// Admin Routes
const AdminRoutes = require("./routes/AdminRoutes");
app.use('/admin',AdminRoutes)


app.listen(port||3000,()=>{
    console.log(`listen on port ${port}`);
})