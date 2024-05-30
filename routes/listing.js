const express  = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedin,isOwner} = require("../middleware.js");
const opencage = require('opencage-api-client');

const listing = require("../models/listing.js");
const Review = require("../models/review.js");

const {upload} = require("../cloudConfig.js");

router.get("/", wrapAsync( async (req,res)=>{
    const allListings = await listing.find({}); 
    if(!allListings){
      req.flash("error","Listing you requested doesnot exist !");
      res.render("./listings");
    }
    res.render("./listings/index.ejs",{allListings});
  }))

router.get("/new", isLoggedin , async (req,res,next)=>{
   res.render("./listings/new.ejs");
 })

//Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { list });
});

router.post("/search", async (req, res) => {
  let { search } = req.body;
  if(search!==""){
    const allListings = await listing.find({ $text: { $search: search } });
    res.render("./listings/index.ejs",{allListings});
  }else{
    const allListings = await listing.find({});
    res.render("./listings/index.ejs",{allListings});
  }
  
});

router.post("/:category", async (req, res) => {
  let { category } = req.params;
  // console.log(category);
  const catlist = await listing.find({'category': category});
  // console.log(catlist);
  res.render("./listings/category.ejs", { catlist,category });
});



router.post("/", isLoggedin, upload.single("image"), wrapAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  let { title, description, price, location, country, category } = req.body;
  let url = req.file.path;
  let filename = req.file.filename;

  if (!title || !description || !price || !location || !country || !category) {
    throw new ExpressError(400, "send valid data");
  }

  // note that the library takes care of URI encoding
  opencage
    .geocode({ q: location, format: 'geojson' })
    .then((data) => {
      console.log(JSON.stringify(data.features[0].geometry));
      if (data.status.code === 200 && data.features.length > 0) {
        const place = data.features[0];
        const [longitude, latitude] = place.geometry.coordinates;
        // console.log(place.formatted);
        // console.log(place.geometry);
        // console.log(place.annotations.timezone.name);

        const newlist = new listing({
          title: title,
          description: description,
          price: price,
          location: location,
          country: country,
          owner: req.user._id,
          image: { url: url, filename: filename },
          geometry:{
            type: 'Point',
            coordinates:[latitude,longitude]
          },
          category:category
        });
         newlist.save();
        req.flash("success", "Listing created successfully !");
        res.redirect("/listings");
      } else {
        console.log('Status', data.status.message);
        console.log('total_results', data.total_results);
      }
    })
    .catch((error) => {
      // console.log(JSON.stringify(error));
      console.log('Error', error.message);
      // other possible response codes:
      // https://opencagedata.com/api#codes
      if (error.status.code === 402) {
        console.log('hit free trial daily limit');
        console.log('become a customer: https://opencagedata.com/pricing');
      }
    });
}))


 router.get("/:id/edit",isLoggedin, wrapAsync( async (req,res)=>{
   let {id} = req.params;
   const list = await listing.findById(id); 
   let originalImageUrl = list.image.url;
    let replacingImageUrl = originalImageUrl.replace("/upload","/upload/h_100,w_100");
   res.render("./listings/edit.ejs",{list,replacingImageUrl});
 }));

 router.put("/:id" ,isLoggedin,upload.single("image"), isOwner, wrapAsync( async (req,res)=>{
   let {id} = req.params;
   let {title,description,image,price,location,country} = req.body;
   
   if(!title || !description || !price || !location || !country){
     throw new ExpressError(400,"send valid data");
   }
   if(typeof req.file != "undifined"){
    let url = req.file.path;
    let filename = req.file.filename;
     const list = await listing.findByIdAndUpdate(id,{
       title:title,
       description:description,
       image: { url: url, filename: filename },
       price:price,
       location:location,
       country:country
     },{runValidators:true,new:true});
   }else{
    const list = await listing.findByIdAndUpdate(id,{
      title:title,
      description:description,
      price:price,
      location:location,
      country:country
    },{runValidators:true,new:true});
   }
    
   req.flash("success","Listing updated successfully !");
   res.redirect(`/listings/${id}`);
 }));

 router.delete("/:id" ,isLoggedin,isOwner, wrapAsync( async (req,res)=>{ 
   let {id} = req.params;
   const list = await listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted successfully !");
   res.redirect("/listings");
 }));

 
 module.exports = router;


 