const db = require('../config/database').pool;
const uuid = require('../utils/uuid');

/****************************************************************
 * CreateNewPhoto
 * Inserts a new photo into the database.
 * Returns array of favorites
 ****************************************************************/
const CreateNewPhoto = async function(photo)
{
    const id = uuid();
    const sql = `
      INSERT INTO 
      photos(id,photo,uploadDate)
      VALUES(UUID_TO_BIN(?,true),?,NOW()) 
    `;
    
    const data = [id,photo];
    const [rows,fields] = await db.query(sql,data);
   
    if(rows.affectedRows != 1) {
      throw new error('Failed to create new photo');
    }
    return (rows.affectedRows ? id : null); 
}


/****************************************************************
 * AddPhotoToListing
 * Assigns a photo to a listing
 ****************************************************************/
const AddPhotoToListing = async function(photoId, listingId){
    const sql = `
      INSERT INTO 
      listingPhotos(listingId,photoId)
      VALUES(UUID_TO_BIN(?,true), UUID_TO_BIN(?,true))
    `;
    const data = [listingId,photoId];
    
    const [rows,fields] = await db.query(sql, data);
    return (rows.affectedRows ? true : null); 

}

const GetPhotosByListingId = async function(listingId){
    const sql = `
      SELECT
        BIN_TO_UUID(photos.id, true) as id,
        photos.photo,
        photos.uploadDate
      FROM
        photos,
        listingPhotos
      WHERE
        photos.id = listingPhotos.photoId
        AND BIN_TO_UUID(listingPhotos.listingId,true) = ?
    `;
    const data = [listingId];
    const [rows,fields] = await db.query(sql, data);
    return (rows.length > 0 ? rows : null);
}


module.exports = {
    CreateNewPhoto,
    AddPhotoToListing,
    GetPhotosByListingId,
}
