const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Tour = require("../model/tour");
const BookedTour = require("../model/booking");


// POST /register
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    // console.log("Received data:", data);

    const findemail = User.findOne({email:data.email})
    if(findemail)
    {
      res.json({
        message:"This email is all ready register try with other email",
        success:false
      })
    }

    const newUser = new User(data);
    const savedUser = await newUser.save(); // save to MongoDB
    // console.log("Data saved:", savedUser);


    
    res.status(201).json({
      message: "User registered successfully!",
      user: savedUser,
      success:true
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/login',async(req,res)=>{

    try{
        const data = req.body;

        const dbData = await User.findOne({username:data.username})
        if(dbData)
        {
          const isPasswordMatch = await dbData.comparePassword(data.password);
            if(isPasswordMatch)
            {
              // console.log("password match")
              console.log(dbData)
              if(data.usertype == dbData.usertype)
              {
                console.log(data);
                res.json({success:true,usersData:dbData.toObject()})
              }
              else{
                res.json({success:false,message:"Please Enter correct details and try again..."})
              }
            }
            else
            {
                res.json({success:false,message:"Password doesn't match"})
            }
        }
        else{
          console.log("user not found");
          res.json({success:false,message:"user not found"})
        }
    }
    catch(err)
    {
        console.error("Error saving user:", err);
    res.status(500).json({ error: "Internal server error" });
    }
})
router.post('/userdetails',async(req,res)=>{

  const loginData = req.body;
  const username = loginData.username

  const response = await User.findOne({username})

  if(response)
  {
    res.json({message:"user found",success:true,data:{response}})
  }
  else
  {
    res.json({message:"user not found",success:false})
  }


})

// booking details fetch
router.post("/BookingDetails",async(req,res)=>{
  try{

  const { userid } = req.body;
  // console.log("into Booking details routes");
  const tourData = await BookedTour.find({userid:userid}).populate("tourid");
  if(tourData)
  {
    res.json({message:"data find successfully",success:true,data:tourData})
  }
  else{
    res.json({message:"data not found",success:false})
  }
}
catch(err)
{
  console.log("error while fetch",err)
  res.json({message:"Internal server Error",success:false})
}
})

  router.post('/forgotPassword', async (req, res) => {
  try {
    const { email, password, confirmPassword, username } = req.body;

    console.log("email:",email," username: ",username)
    const user = await User.findOne({ email: email, username: username });

    if (user) {
      // console.log("User found:", user);
      await User.findOneAndUpdate({email:email,username:username},{$set:{password:password}})
      
      return res.json({
        success: true,
        message: "Password Change Succeessfully",
        user
      });
    } else {
      // console.log("User not found");
      return res.json({
        success: false,
        message: "Email or username incorrect"
      });
    }

  } catch (err) {
    console.log("Internal Server Error", err);
    res.json({ message: "Internal Server Error", success: false });
  }
});

  
module.exports = router;
