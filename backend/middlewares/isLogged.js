module.exports.isLogged = (req , res , next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl ;
    req.flash("error" , "you must be logged in to create listing");
    return res.redirect("/listings");
  
  }
    next();
}

module.exports.saveRedirectUrl = (req , res , next) => {
  res.locals.redirectUrl = req.session.redirectUrl ;
  next();
}