const express = require("express");
const router = express.Router();

const tour = require("../model/tour");
const Rating  = require("../model/rating");

router.get('/tourPackage',async function(req,res){

    try{
    const tourData = await tour.find();
    if(tourData)
    {
        res.json({success:true,message:"data find successfully",data:{tourData}})
    }
    else
    {
        res.json({success:false,message:"data not found"})
    }
    }
    catch(err)
    {
        console.log("error from packages getting ",err)
        res.status(500).json({error:"internal Server Error"})
    }
})

router.get('/tourpackage/:id',async function (req,res){
    const id = req.params.id;


    const data =await tour.findOne({_id:id})

    
})

router.post('/ratings',async(req,res)=>{

    // console.log("yes you are into rating routes");
    // console.log("Rating request body:", req.body); 
    try{
    const {rating,comment,tourid,username,userid} = req.body;

    if (!rating || !comment || !tourid || !userid) {
      return res.json({ success: false, message: "All fields are required!" });
    }

    // Check duplicate rating
    const alreadyGiven = await Rating.findOne({ tourid: tourid, userid: userid });
    if (alreadyGiven) {
      return res.json({
        success: false,
        message: "You already rated this tour!"
      });
    }

    const newRating = new Rating({rating,comment,tourid,username,userid})
    await newRating.save();

     res.json({
      success: true,
      message: "Rating submitted successfully!"
    });

  } catch (err) {
    console.log("Rating Error:", err);
    res.json({ success: false, message: "Internal server error" });
  }
});

router.get("/ratings/:id",async (req,res)=>{

  const id = req.params.id;

  try{
    
    const data = await Rating.find({tourid:id})
    // console.log(data);
    if(!data || data.length === 0)
    {
      res.json({message:"no reviews available",success:false,reviewsData:data})
    }
    else{
      res.json({message:"reviews find successfully",success:true,reviewsData:data})
    }

  }
  catch(err)
  {
    console.log("error while fetching reviews:",err);
    res.status(500).json({ success: false, message: "Server error" });
  }

  // console.log(id);
})


module.exports = router