const Photo = require("../models/photo");
const Listing = require("../models/listing");
const Amenities = require("../models/amenities");
const Lease = require("../models/lease");

const getAllListings = async function (req, res, next) {
  try {
    const listings = await Listing.getAllListing();
    return res.status(200).send({
      listings: listings,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in the request",
    });
  }
};

const getListingById = async function(req, res, next) {
  try {
    const listingId = req.params.id;
    if(!listingId) {
      return res.status(200).json({
        error: "Listing id was not provided"
      });
    }

    const listing = await Listing.getListingById(listingId);
    if(!listing) {
      return res.status(200).json({
        error: "Listing not found"
      });
    }

    const listingPhotos = await Photo.GetPhotosByListingId(listing.id);
    return res.status(200).json({
      listing: listing,
      photos: listingPhotos
    });
    
  } catch(err) {
    console.log(err);
    return res.status(200).json({
      error: "Error in the request"
    });
  }
};

const getListingsByLandlordId = async function (req, res, next) {
  try {
    const landlordId = req.params.id;
    if(!landlordId) {
      return res.status(200).json({
        error: "Landlord id was not provided"
      });
    }

    const listings = await Listing.getListingsByLandlordId(landlordId);
    if(!listings) {
      return res.status(200).json({
        error: "Listings not found"
      });
    }

    for(let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const photos = await Photo.GetPhotosByListingId(listing.id);
      listings[i].photos = photos;
    } 

    return res.status(200).json({
      listings: listings
    });
    
  } catch(err) {
    console.log(err);
    return res.status(200).json({
      error: "Error in the request"
    });
  }
}

const createListing = async function (req, res, next) {
  //Here we will use Landlord Or User ID?
  const landlordId = req.body.landlordId;
  const price = req.body.price;
  const location = req.body.location;
  const description = req.body.description;
  //For DB, True/False 0 or 1,
  const verification = false;
  const availability = true;

  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  //Amenities structure
  const amenities = {
    washer: req.body.washer || 0,
    dryer: req.body.dryer || 0,
    wifi: req.body.wifi || 0,
    closet: req.body.closet || 0,
    furnished: req.body.furnished || 0,
    kitchen: req.body.kitchen || 0,
    whiteboard: req.body.whiteboard || 0,
    bath: req.body.bath || 0,
    livingroom: req.body.livingroom || 0,
    patio: req.body.patio || 0,
    parking: req.body.parking || 0,
  };

  if (!price.match(/^\d+$/)){
    return res.status(400).send({
      error: 'Please enter a valid number value for price'
    });
  } 

  // if(!(availability === '1' || availability === '0'))
  // {
  //   return res.status(400).send({
  //     error: 'Please enter either 1 or 0 for availability'
  //   });
  // }

  //Validate the data
  try {
    //Creating the new listing table
    const listing = await Listing.createNewListing(
      landlordId,
      price,
      location,
      description,
      verification,
      availability,
      latitude,
      longitude
    );

    // Create the amenities table for this listing
    const createdAmenities = await Amenities.createAmenities(
      listing.id,
      amenities
    );

    return res.status(201).json(listing);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: "Error occurred while creating listing",
    });
  }
};

getListingLocation = async function (req, res, next) {
  const listingId = req.params.id;
  //Model function
  const location = await Listing.getLocation(listingId);

  res.status(200).json({
    location: location,
    message: "Returning Lat / Long",
  });

  // console.log(location);
};

const deleteListing = async function (req, res, next) {
  const listingId = req.params.id;
  const deleted = await Listing.removeListing(listingId);

  res.status(202).json({
    message: "Deleted Listing"
  });
};


const editListing = async function (req, res, next) {
  const listingId = req.body.listingId;
  const price = req.body.price;
  const description = req.body.description;
  const availability = req.body.availability || 1;
  const washer =req.body.washer || 0;
  const dryer = req.body.dryer || 0;
  const wifi = req.body.wifi || 0;
  const closet =req.body.closet || 0;
  const furnished = req.body.furnished || 0;
  const kitchen = req.body.kitchen || 0;
  const whiteboard =req.body.whiteboard || 0;
  const bath = req.body.bath || 0;
  const livingroom = req.body.livingroom || 0;
  const patio = req.body.patio || 0;
  const parking = req.body.parking || 0;

  //Check for validation, will have to force user to enter data\
  if (!price.match(/^\d+$/)){
    return res.status(400).send({
      error: 'Please enter a valid number value for price'
    });
  } 

  // if(!(availability === '1' || availability === '0'))
  // {
  //   return res.status(400).send({
  //     error: 'Please enter either 1 or 0 for availability'
  //   });
  // }
  
//Will need to error check Price
  try {
    await Listing.editListing(listingId, price, description, availability);

    await Listing.editedAmenities(listingId, washer, dryer,
    wifi, closet, furnished, kitchen, whiteboard, bath, livingroom, patio, parking);


    return res.status(200).json({
      message: 'Successfully updated the listing',
      id: listingId
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      error: 'Failed to update the listing'
    });
  };
}

const verificationListing = async function (req, res, next) {

  verification = req.body.verification;
  listingId = req.body.listingId;

  //Check

  if (!(verification === '0' || verification === '1')) {
    return res.status(400).json({
      error: "Incorrect value for verification, must be 1 or 0"
    });
  }
  try {
    // Search for listings that match the given amenities
    await Listing.verifyListing(listingId, verification);
    return res.status(200).send({
      message: 'Successfully verified the listing'
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: 'Error in the request'
    });
  }


}
const createLease = async function (req, res, next) {

  const studentId = req.body.studentId;
  const listingId = req.body.listingId;
  const startedAt = new Date();
  const endedAt = new Date();
  const contract = req.body.contract;

  if (studentId === 'undefined' && listingId === 'undefined') {
    res.status(400).json({
      error: "Error creating the lease"
    });
  }

  if (await Lease.hasLease(studentId) > 0) {
    return res.status(400).send({
      error: "This student already has a lease"
    });
  }

  console.log(await Lease.hasLease(studentId));
  await Lease.createNewLease(listingId, studentId, contract, startedAt, endedAt);

  return res.status(200).send({
    message: "Created the new Lease!"
  });
}

module.exports = {
  createListing,
  deleteListing,
  getListingLocation,
  getListingById,
  getListingsByLandlordId,
  getAllListings,
  createLease,
  editListing,
  verificationListing
};