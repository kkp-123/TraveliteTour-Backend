const express = require('express')
const axios = require('axios');
const generateOtp = require('../generateOtp');
const router = express.Router();
const bodyparser = require('body-parser');

require("dotenv").config();

router.use(bodyparser.json())



let otpStore = {}
router.post('/sendOtp',async function(req,res){


    const { email,purpose } = req.body; 
    if (!email) {
    return res.status(400).send({ success: false, message: 'Email is required' });
    }
    let otp = generateOtp()
    // console.log(otp);
    const bravoApi = process.env.BREVO_API_KEY
    let subject = "";
    let htmlContent = "";

    switch(purpose)
    {
        case "Booking":
        {
            subject = "verify your booking"
            htmlContent = `
                <h2>Verify Your Booking</h2>
                <p>Your booking verification OTP is:</p>
                <h1>${otp}</h1>
            `;
            break;
        }
        case "Register":
            {
                subject = "Verify Registeration"
                htmlContent = `
                 <h2>Welcome to Travelite</h2>
                <p>Your registration OTP is:</p>
                <h1>${otp}</h1>
                `;
                break;
            }
        case "ForgotPassword":
            {
                subject = "Password Reset Otp"
                htmlContent = `
                <h2>Reset Password Request</h2>
                <p>Your OTP to reset the password is:</p>
                <h1>${otp}</h1>
                `;
                break;
            }
             default:
        return res.status(400).json({
            success: false,
            message: "Invalid OTP purpose",
        });
    }
    
    try{
        await axios.post('https://api.brevo.com/v3/smtp/email',{
            

            sender:{email:"kkp451807@gmail.com",name:"krish Patel"},
            to:[{email}],
            subject,
            htmlContent
        },
        {
            headers:{
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type':'application/json',
                Accept:'application/json'

            }
        }
       
    )
     otpStore[email] = otp;
     res.send({success:true})
    }
     catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Failed to send OTP. Please try again.');
    }
})

router.post('/verifyOtp',async function(req,res){

    const {email,otp} = req.body;
    if (!otpStore[email]) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired. Please request a new OTP.",
    });
  }

    if(otpStore[email].toString().trim()== otp.toString().trim())
    {
        console.log("success");
        delete otpStore[email];
        res.send({success:true,message:"otp verified successfully"})
        

    }
})


module.exports = router