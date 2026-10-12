const express = require("express");
const router =  express.Router();
const User = require("../models/user.js");
const passport = require("passport") ;
const userController = require("../controllers/user.js");

router.get("/signup" ,userController.getSignUp);

router.post("/signup" , userController.signUp);

router.get("/login" , userController.getLogin );

router.post("/login" , passport.authenticate("local" , 
    {failureRedirect: "/login" , 
    failureFlash: true}), userController.login
     );

router.get("/logout" , userController.logOut);
module.exports = router ;