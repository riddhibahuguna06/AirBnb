module.exports.editListing = async(req ,res) => {
  let {id} = req.params ;
  let listing = await Listing.findById(id);

if(!listing){
  req.flash("error" , "Listing doesnot exists");
  return res.redirect("/listings");
}
   req.flash("success" , "Listing edited ");
  res.render("listings/edit.ejs" , {listing});
} ;

module.exports.updateListing = async(req , res) => {
  let {id} = req.params ;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
   req.flash("success" , "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req , res) => {
let {id} = req.params;
await Listing.findByIdAndDelete(id);
req.flash("success" , "Listing deleted sucessfully");
res.redirect("/listings");
};

module.exports.showListing = async (req ,res) => {
let {id} = req.params ;

console.log("ID received:", id);

const listing = await Listing.findById(id);

if(!listing){
  req.flash("error" , "Listing doesnot exists");
  return res.redirect("/listings");
}
res.render("listings/show.ejs" , {listing} );
};

module.exports.createListing = async(req , res , next ) => {

let newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "New Listing created");
  res.redirect("/listings");
  
} ;

module.exports.indexRoute = async (req , res) => {
const allListings = await Listing.find({});
res.render("listings/index.ejs" , {allListings});
};

module.exports.newListing = (req , res , next) => {
  res.render("listings/new.ejs");
}

