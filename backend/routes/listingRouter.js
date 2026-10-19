const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const ExpressError = require("../utils/expressError.js");
const {isLogged} = require("../middlewares/isLogged.js");
const listingController = require("../controllers/listings.js");

const validateSchema = (req, res, next) => {
  const {error} = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}


//index route
router.get("/" , wrapAsync(listingController.indexRoute)
);
router.get("/new" , isLogged , listingController.newListing);

// create route
router.post("/" ,
    isLogged , 
   validateSchema , 
   upload.single("listing[image]") ,
   wrapAsync(listingController.createListing)
);

//edit route
router.get("/:id/edit"  , isLogged ,  wrapAsync(listingController.editListing)
);

//update route 
router.put("/:id" , upload.single("listing[image]") , validateSchema , wrapAsync(listingController.updateListing)
);

//delete route
router.delete("/:id/delete" , isLogged ,  wrapAsync(listingController.deleteListing)
);


//show route
router.get("/:id", wrapAsync( listingController.showListing)
);



module.exports = router;