const express  = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedin,isOwner,isReviewAuthor} = require("../middleware.js");

const listing = require("../models/listing.js");
const Review = require("../models/review.js");


router.post("/" ,isLoggedin, wrapAsync( async (req,res)=>{
    let list = await listing.findById(req.params.id);
    let {comment,rating} = req.body;
    console.log(req.user);
    let newReview = new Review({
     comment:comment,
     rating:rating,
     author:req.user._id,
   });
 
   list.reviews.push(newReview);
   
   await newReview.save();
   await list.save();
   req.flash("success","Review created successfully !");
   res.redirect(`/listings/${req.params.id}`);

}))
 
    router.delete("/:reviewId" ,isLoggedin,isReviewAuthor, wrapAsync( async (req,res)=>{
     let {id,reviewId} = req.params;
     await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Listing deleted successfully !");
     res.redirect(`/listings/${id}`);
     }))
 
     

     module.exports = router;