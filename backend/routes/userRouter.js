const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");
const passport = require("passport") ;

router.get("/signup" , (req , res) => {
  res.render("users/signUp.ejs");
});

router.post("/signup" , async(req ,res ) => {
  try{let {username , email , password} = req.body ;

    const newUser = new User({email , username}) ;
    User.register(newUser , password);
    req.flash("success" , "Welcome to Wanderer");
}
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
});

router.get("/login" , async(req , res) => {
    res.render("users/login");
});

router.post("/login" , passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}), async(req , res) => {
res.flash("success" , "Welcome to Wanderer");
})
module.exports = router ;