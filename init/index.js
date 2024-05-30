const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require ("../models/listing.js");

dburl = "mongodb://127.0.0.1:27017/airbnb";

main().then(()=>{
    console.log("DB connected");
}).catch((err)=>{
   console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}

const initDB = async ()=>{
    await listing.deleteMany({});
    let newData = initdata.data.map((obj)=>({...obj,owner:"6634ecb8e4dfaa4213ee3c7c"}))
    await listing.insertMany(newData)
}

initDB();