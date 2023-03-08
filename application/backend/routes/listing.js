const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/listing");
const AmenitiesController = require("../controllers/listing");

// get listings
router.get("/", (req,res,next) => {
 ListingController.getAllListings(req,res,next);
});

// get single listing
router.get("/:id", (req,res,next)=>{
  // ListingController.getListingLocation(req,res,next);   
  ListingController.getListingById(req, res, next);
});

// get landlord's listings
router.get("/landlord/:id", (req, res, next) => {
  ListingController.getListingsByLandlordId(req, res, next);
});

// create single listing
router.post("/", (req, res, next) => {
  ListingController.createListing(req, res, next);
});


router.post("/lease", (req, res, next) => {
  console.log("Entering Lease");
  ListingController.createLease(req,res,next);
});
// update single listing
router.put("/edit", (req, res, next) => {
  console.log("Editing Listing");
  ListingController.editListing(req,res,next);
});

router.put("/verify", (req,res,next) => {
  console.log("Verifying the listing");
  ListingController.verificationListing(req,res,next);
});

// delete single listing
router.delete("/:id", (req,res,next) => {
  console.log("Attempting to delete listing with ID");
  ListingController.deleteListing(req,res,next);

});

module.exports = router;
