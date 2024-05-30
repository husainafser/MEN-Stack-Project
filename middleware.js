
const listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // saved in req.session for accessing anywhere
        console.log(req.session.redirectUrl)
        req.flash("error","You must be logged in !")
        return res.redirect('/login');
    }
    next();
}

//creating middleware to save original url in local variable becuase passport will be empty session variable when loggedin
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
   let checkList = await listing.findById(id);
   if(req.user && !req.user._id.equals(checkList.owner._id)){
    req.flash("danger","You don't have permission to edit !");
    return res.redirect(`/listings/${id}`);
   }
   next()
}

module.exports.isReviewAuthor = async (req,res,next)=>{
   let {id,reviewId} = req.params;
   let review = await Review.findById(reviewId);
   if(req.user && !req.user._id.equals(review.author)){
    req.flash("danger","You don't have permission to delete !");
    return res.redirect(`/listings/${id}`);
   }
   next()
}
