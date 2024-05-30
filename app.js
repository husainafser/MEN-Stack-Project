const express = require("express");
const app=express();
require("dotenv").config();
const Listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");

var methodOverride = require('method-override');
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

const ejs=require("ejs");
const path = require("path");
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

const mongoose=require("mongoose");
// dburl = "mongodb://127.0.0.1:27017/airbnb";
dburl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("DB connected");
}).catch((err)=>{
   console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}

const store = mongoStore.create({
  mongoUrl : process.env.ATLASDB_URL,
  crypto :{
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600,
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
     expires : Date.now + 1000 * 60 * 60 *24 * 3,
     maxAge: 1000 * 60 * 60 *24 * 3,
     httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

//add user
passport.serializeUser(User.serializeUser());
//remove user
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next(); 
})


app.use("/listings", Listings);

app.use("/listings/:id/reviews" , reviews);

app.use("/" , user);



app.all("*",(req,res,next)=>{
  next( new ExpressError(404,"404 page not found !"));
})  
    
    app.use((err,req,res,next)=>{
      let {statusCode=500,message="something went wrong"} = err;
    
      res.status(statusCode).render('error.ejs',{err,statusCode});
    })

app.listen(8080,()=>{
    console.log("server is running on port 8080")
});
