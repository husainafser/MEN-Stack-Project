const express  = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")



const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");


router.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {email,username,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wonderlust !");
            res.redirect('/listings');
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("./user/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),(req,res)=>{
    req.flash("success","Welcome to wonderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
})
 
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("error","You are logged out!");
        res.redirect("/listings");
    })
})

 module.exports = router;