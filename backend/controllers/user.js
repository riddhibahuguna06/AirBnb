module.exports.getSignUp = (req , res) => {
  res.render("users/signUp.ejs");
}

module.exports.signUp = async(req ,res ) => {
  try{
    let {username , email , password} = req.body ;

    const newUser = new User({email , username}) ;
   const registeredUser = await User.register(newUser , password);
   
   req.login(registeredUser , (err) => {
    if(err){
       return next(err)
    }
    req.flash("success" , "Welcome to Wanderer");
    res.redirect("/listings");

   });

}
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/user/signup");
    }
}

module.exports.getLogin = async(req , res) => {
    res.render("users/login");
}

module.exports.login = async(req , res) => {

    res.flash("success" , "Welcome to Wanderer");
    let redirectUrl = res.locals.redirect || "/listings"
   res.redirect(redirectUrl);
}

module.exports.logOut =  (req , res , next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out");
        res.redirect("/listings");
    });
}