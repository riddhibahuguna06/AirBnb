const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressError.js");
const {isLogged} = require("../middlewares/isLogged.js");

const validateSchema = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}


//index route
router.get("/" , wrapAsync(async (req , res) => {
const allListings = await Listing.find({});
res.render("listings/index.ejs" , {allListings});
})
);


router.get("/new" , isLogged , (req , res , next) => {
  res.render("listings/new.ejs");
});

//create route
router.post("/" , validateSchema , wrapAsync(async(req , res , next ) => {

let newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "New Listing created");
  res.redirect("/listings");
  
})
);

//edit route
router.get("/:id/edit"  , isLogged ,  wrapAsync(async(req ,res) => {
  let {id} = req.params ;
  let listing = await Listing.findById(id);

if(!listing){
  req.flash("error" , "Listing doesnot exists");
  return res.redirect("/listings");
}
   req.flash("success" , "Listing edited ");
  res.render("listings/edit.ejs" , {listing});
})
);

//update route 
router.put("/:id" , validateSchema , wrapAsync(async(req , res) => {
  let {id} = req.params ;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
   req.flash("success" , "Listing updated");
  res.redirect(`/listings/${id}`);
})
);

//delete route
router.delete("/:id/delete" , isLogged ,  wrapAsync(async (req , res) => {
let {id} = req.params;
await Listing.findByIdAndDelete(id);
req.flash("success" , "Listing deleted sucessfully");
res.redirect("/listings");
})
);


//show route
router.get("/:id", wrapAsync( async (req ,res) => {
let {id} = req.params ;

console.log("ID received:", id);

const listing = await Listing.findById(id);

if(!listing){
  req.flash("error" , "Listing doesnot exists");
  return res.redirect("/listings");
}
res.render("listings/show.ejs" , {listing} );
})
);



module.exports = router;