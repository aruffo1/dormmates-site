const Favorite = require('../models/favorite');
const Photo = require('../models/photo');

/********************************************************************
 * This function takes in a body request of a listingId and 
 * studentId to allow a studet user to favorite a listing post.
 * It matches the studentId with the listingId and stores them
 * into the database.
 * Returns: 
 *    200 if successful and message listing was favorited
 *    400 if unsuccessful in finding the student user or listing 
 *******************************************************************/
const createFavorite = async function (req, res, next) {
  const listingId = req.body.listingId;
  const studentId = req.body.studentId;

  //validation check
  if (listingId !== undefined && studentId !== undefined) {
    await Favorite.createNewFavorite(listingId, studentId);
    return res.status(200).send({
        message: 'Successfully favorited listing'
    });
  }
  else {
    res.status(400).send({
      message: 'Error could not find the user or listing'
    });
  }
};

/****************************************************************
 * This function takes in a parameter of a studentId and fetches 
 * all paired listingIds to it. It will display all found listings
 * that matched the listingId. 
 * Returns:
 *    200 if successful
 *    400 if error in finding the student or the listing
 ****************************************************************/
const getFavoriteList = async function (req, res, next) {
  const studentId = req.params.studentId;

  if (studentId !== undefined) {
    const listings = await Favorite.getStudentFavoriteList(studentId)
    
    for(let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const photos = await Photo.GetPhotosByListingId(listing.id);
      listings[i].photos = photos;
    } 

    return res.status(200).send({
      listings: listings
    });
  }
  else {
    return res.status(400).send({
      message: 'Error could not find user or favorited listings'
    })
  }
}

/*******************************************************************
 * This function is used to delete favorites of students. It takes
 * two path parameters of a studentId and listingId and checks if 
 * they are paired. If they are the favorite is removed from the db
 * Return: 
 *    202 if successful
 *******************************************************************/
const removeFavorite = async function (req, res, next) {
  const listingId = req.params.listingId;
  const studentId = req.params.studentId;

  const deleted = await Favorite.deletingFavorite(listingId, studentId)
  res.status(202).json({
    message: "Successfully removed the favorite"
  })
}

module.exports =
{
  createFavorite,
  getFavoriteList,
  removeFavorite
}