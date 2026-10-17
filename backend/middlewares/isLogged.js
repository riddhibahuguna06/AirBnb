module.exports.isLogged = (req , res , next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl ;
      // console.log(req.session.redirectUrl);
    req.flash("error" , "you must be logged in to create listing");
    return res.redirect("/user/login");
  
  }
    next();
}

module.exports.saveRedirectUrl = (req , res , next) => {
  if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl ;
  }
  next();
}