const db = require('../config/database').pool;

/****************************************************************
 * createNewFavorite
 * Inserts a new favorite into the database.
 * Returns array of favorites
 ****************************************************************/
const createNewFavorite = async function(listingId, studentId)
{
    const sql = `
    INSERT INTO 
    favorite(listingId, studentID)
    VALUES(UUID_TO_BIN(?,true),UUID_TO_BIN(?,true)) 
    `;
    
    const data = [listingId,studentId];
    const [rows,fields] = await db.query(sql,data);
    if(rows.affectedRows != 1)
    {
        throw new error('Failed to favorite the listing');
    }
    return (rows.affectedRows ? data : null); 
}


/****************************************************************
 * getStudentFavoriteList
 * Fetches all listings that are paired with the studentId in 
 * the db
 * Returns: an array of favorites
 ****************************************************************/
const getStudentFavoriteList = async function(studentId){
    const sql = `
    SELECT BIN_TO_UUID(id,true) AS id,  BIN_TO_UUID(landlordId,true) AS landlordId, price, location, description, verification, availability, listingLatitude, listingLongitude
    FROM listing  
    WHERE BIN_TO_UUID(id,true) IN
    (
        SELECT BIN_TO_UUID(listingId,true)
        FROM favorite
        WHERE studentId = UUID_TO_BIN(?,true) 
    );
    `;
    // const sql =` 
    // SELECT BIN_TO_UUID(listingID,true)
    // FROM favorite 
    // WHERE studentID = UUID_TO_BIN(?,true) 
    // `;
    const data = [studentId];
    const [favorites,fields] = await db.query(sql, data);
    return favorites;
}


/****************************************************************
 * deletingFavorite
 * Deletes a favorite from the database
 ****************************************************************/
const deletingFavorite = async function(listingId,studentId)
{
    const sql = `
        DELETE FROM favorite
        WHERE listingID = UUID_TO_BIN(?, true) AND studentId = UUID_TO_BIN(?, true)
    `;
    const data = [listingId,studentId];
    const [rows, fields] = await db.query(sql,data);

    if(rows.affectedRows !== 1)
    {
        throw new Error("Failed to delete listing");
    }
}

module.exports = {
    createNewFavorite,
    getStudentFavoriteList,
    deletingFavorite
}
