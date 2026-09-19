const express = require("express");
const app = express();

const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderer";

const Listing = require("./models/listing.js");

const path = require("path");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
} ;

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.send("Hi , I am root");
});

// app.get("/testListings", async (req, res) => {
//   let sampleListings = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });

//   await sampleListings.save();
//   cosole.log("Sample was saved");
//   res.send("Sucessfull");
// });
 
//index route
app.get("/listings" , async (req , res) => {
const allListings = await Listing.find({});
res.render("listings/index.ejs" , {allListings});
});

//show route
app.get("/listings/:id" , async (req ,res) => {
let {id} = req.params ;

console.log("ID received:", id);

const listing = await Listing.findById(id);
res.render("listings/show.ejs" , {listing} );
});

app.get("/listings/new" , (req , res) => {
  res.render("/listing/new.ejs");
// const {title , description , price , location , country } = 
});
app.listen(8080, () => {
  console.log("Server is running");
});
