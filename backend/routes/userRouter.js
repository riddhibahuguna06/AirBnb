const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");

router.get("/signup" , (req , res) => {
  res.render("users/signUp.ejs");
});

router.post("/signup" , async(req ,res ) => {
  try{let {username , email , password} = req.body ;

    const newUser = new User({email , username}) ;
    User.register(newUser , password);
    req.flash("success" , "Welcome to Wanderer");}
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
});
module.exports = router ;