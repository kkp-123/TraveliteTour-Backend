const express = require('express');
const router = express.Router();

const Tour = require('../model/tour');
const User = require('../model/User');
const Booking = require('../model/booking');

router.post('/adminRegister',async(req,res)=>{

  try{

    const {name,usertype,email,mobile,username,password} = req.body;
    
    const userAdmin = new User({name,usertype,email,mobile,username,password});
    await userAdmin.save();

    res.json({message:"admin add successfully",success:true});
    
  }
  catch(err)
  {
    console.log("Error while register admin",err);
    res.status(500).json({message:"internal server error",success:false});
  }
})

router.get('/adminHome', async (req, res) => {
  try {
    // Run all 3 queries in parallel
    const [tourCount, userCount, bookingCount] = await Promise.all([
      Tour.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.json({
      success: true,
      message: "Data fetched successfully",
      data: {
        tours: tourCount,
        users: userCount,
        bookings: bookingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin data",
      error: error.message,
    });
  }
});

router.get('/userDetails', async (req,res)=>{

  try{
  const users = await User.find();

  if(users)
  {
  res.json({
    success:true,
    message:"user find successfully",
    data:users
  })
}
res.json({
  success:false,
  message:"user not found"
})
}
catch(err)
{
  console.error("Error fetching admin data:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching user Data",
      error: err.message,
    });
}
})

router.get('/allBookings', async (req, res) => {
  try {
    const bookData = await Booking.find()
      .populate("userid", "name email mobile")  // only select what is needed
      .populate("tourid", "title price duration img_url"); // if you want tour details too

    if (!bookData || bookData.length === 0) {
      return res.json({
        success: false,
        message: "No bookings found",
      });
    }

    res.json({
      success: true,
      message: "Bookings fetched successfully",
      bookData
    });
  } catch (err) {
    // console.error("Error fetching all bookings:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching bookings",
      error: err.message,
    });
  }
});

router.post("/addTour",async (req,res)=>{

  const formdata = req.body;
  const formatedFormData = {
      ...formdata,
      offer: {
    hasOffer: formdata.offer>0,
    discountPercent: formdata.offer || 0,
    finalPrice: formdata.price ?
              formdata.price - (formdata.price * (formdata.offer || 0) / 100) 
                : 0
    }
  }

  try{
    if(formdata)
    {
      const tour = new Tour(formatedFormData);
      const savedTour = await tour.save();
      // console.log("Tour add successfully");

      res.json({
        message:"Tour save successfully",
        success:true,
      })
    }
    else
      {
      // console.log("data not added because its missing");
      res.json({
        message:"not save tour",
        success:false
      })
    }

  }
   catch (err) {
    // console.error("Error saving tour:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.put("/updateTour/:id", async (req, res) => {
  try {
    const tourId = req.params.id;
    const formdata = req.body;

    const formatedFormData = {
      ...formdata,
      offer: {
    hasOffer: formdata.offer>0,
    discountPercent: formdata.offer || 0,
    finalPrice: formdata.price ?
              formdata.price - (formdata.price * (formdata.offer || 0) / 100) 
                : 0
    }
  }

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      formatedFormData,
      { new: true } // return updated record
    );

    if (!updatedTour) {
      return res.json({
        success: false,
        message: "Tour not found"
      });
    }

    res.json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server error while updating tour"
    });
  }
});

// ----------------------
// DELETE TOUR (DELETE)
// ----------------------
router.delete("/deleteTour/:id", async (req, res) => {
  try {
    const tourId = req.params.id;

    const deleted = await Tour.findByIdAndDelete(tourId);

    if (!deleted) {
      return res.json({
        success: false,
        message: "Tour not found"
      });
    }

    res.json({
      success: true,
      message: "Tour deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server error while deleting tour"
    });
  }
});

router.get("/recentTour",async(req,res)=>{

  const response = await Tour.find().sort({_id:1}).limit(8);
  if(response)
  {
    res.json({success:true,message:"tours find",data:response})
  }
})



module.exports = router;


module.exports = router;
