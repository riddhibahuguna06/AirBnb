const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userSchema = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderer";

const Listing = require("./models/listing.js");

const path = require("path");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const { valid } = require("joi");
const Review = require("./models/review.js");

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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true
};

app.get("/", (req, res) => {
  res.send("Hi , I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.sessions());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
})
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

const validateSchema = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}
 
const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}

//index route
app.get("/listings" , wrapAsync(async (req , res) => {
const allListings = await Listing.find({});
res.render("listings/index.ejs" , {allListings});
})
);


app.get("/listings/new" , (req , res , next) => {
  res.render("listings/new.ejs");
});

//create route
app.post("/listings" , validateSchema , wrapAsync(async(req , res , next ) => {

let newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "New Listing created");
  res.redirect("/listings");
  
})
);

//edit route
app.get("/listings/:id/edit"  , wrapAsync(async(req ,res) => {
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
app.put("/listings/:id" , validateSchema , wrapAsync(async(req , res) => {
  let {id} = req.params ;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
   req.flash("success" , "Listing updated");
  res.redirect(`/listings/${id}`);
})
);

//delete route
app.delete("/listings/:id/delete" , wrapAsync(async (req , res) => {
let {id} = req.params;
await Listing.findByIdAndDelete(id);
req.flash("success" , "Listing deleted sucessfully");
res.redirect("/listings");
})
);

//review route
app.post("/listings/:id/reviews" ,  validateReview , wrapAsync (async(req ,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect("/listings") ;

}))


//show route
app.get("/listings/:id", wrapAsync( async (req ,res) => {
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


app.all("/{*splat}" , (req , res , next) => {
  
  next(new ExpressError (404 , "page not found"));
})

app.use((err , req , res , next) => {
  let {statusCode = 500 , message ="Something went wrong"} = err ;
  res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log("Server is running");
});
