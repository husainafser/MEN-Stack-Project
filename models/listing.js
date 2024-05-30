const mongoose = require("mongoose");
const Review = require("./review.js");

const Schema = mongoose.Schema;
 
const listingSchema = new Schema ({
    title:{
        type:String,
        required:true
    },

    description:String,

    image:{
      url:String,
      filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [ //multiple ids of reviews so created array
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{ // created object for single id of owner
        type: Schema.Types.ObjectId,
        ref:"User"
      },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category : {
      type: String,
       enum : ["Amazing Pools","Amazing Views","Farms","Luxu","Lakefront","Islands","Castles","Beachfront","Camping"],
    }  
    
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in:listing.reviews}});
  }
})
listingSchema.index({ title: 'text', location: 'text', country: 'text'});

const listing = mongoose.model("Listing",listingSchema);
module.exports = listing;