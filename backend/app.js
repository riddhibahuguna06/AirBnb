const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User= require("./models/user.js");
const listingRouter = require("./routes/listingRouter.js");
const userRouter = require("./routes/userRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderer";

const ExpressError = require("./utils/expressError.js");



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
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/user" , userRouter);

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

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is running");
});
