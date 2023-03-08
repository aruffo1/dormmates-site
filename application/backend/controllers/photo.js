const Photo = require('../models/photo');

const uploadPhoto = async function (req, res, next) {
  const photo = req.body.photo;
  const listingId = req.body.listingId;

  // validation
  if (!photo || !listingId) {
    return res.status(400).send({
      message: 'Error: photoId and listingId are required'
    });
  }
  if (photo.substring(0, 4) !== 'data') {
    return res.status(400).send({
      message: 'Error: photo is not base64 encoded'
    })
  };

  // Upload the photo to the db
  const photoUploaded = await Photo.CreateNewPhoto(photo);
  if(!photoUploaded) {
    return res.status(400).send({
      message: 'Error: photo is already added to this listing'
    })
  }

  console.log(photoUploaded);

  // link photo to listing
  const success = await Photo.AddPhotoToListing(photoUploaded, listingId);
  if(!success) {
    return res.status(400).send({
      message: 'Error: photo is already added to this listing'
    })
  }

  return res.status(200).send({
    message: 'Photo added to listing',
    id: photoUploaded
  });
};

// const addPhotoToListing = async function (req, res, next) {
//   const photoId = req.body.photoId;
//   const listingId = req.body.listingId;

//   // validate photoid and listingid
//   if (!photoId || !listingId) {
//     return res.status(400).send({
//       message: 'Error: photoId and listingId are required'
//     });
//   }

//   const success = await Photo.AddPhotoToListing(photoId, listingId);
//   if(!success) {
//     return res.status(400).send({
//       message: 'Error: photo is already added to this listing'
//     })
//   }

//   return res.status(200).send({
//     message: 'Photo added to listing'
//   });
// }

const getByListingId = async function (req, res, next) {
  const listingId = req.body.listingId;
  
  // Validate listingId
  if (!listingId) {
    return res.status(400).send({
      message: 'Error: listingId is required'
    });
  }

  const photos = await Photo.GetPhotosByListingId(listingId);
  if(!photos) {
    return res.status(404).send({
      message: 'Error: no photos found'
    });
  }
  return res.status(200).send(photos);
};



module.exports = {
  uploadPhoto,
  getByListingId
}