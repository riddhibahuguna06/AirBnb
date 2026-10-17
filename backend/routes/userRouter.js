const express = require("express");
const router =  express.Router();

const passport = require("passport") ;
const userController = require("../controllers/user.js");
const {saveRedirectUrl} = require("../middlewares/isLogged.js");

router.get("/signup" ,userController.getSignUp);

router.post("/signup" , userController.signUp);

router.get("/login" ,  userController.getLogin );

router.post("/login" , saveRedirectUrl , passport.authenticate("local" , 
    {failureRedirect: "/login" , 
    failureFlash: true}), userController.login
     );

router.get("/logout" , userController.logOut);
module.exports = router ;