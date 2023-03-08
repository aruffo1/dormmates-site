const db = require('../config/database').pool;
const uuid = require('../utils/uuid');

/********************************************************************* 
 * getByUserId
 * Searches for a landlord by their user id
 * Returns a landlord profile
 ********************************************************************/
 const getByUserId = async function(userId){
    const sql = `
        SELECT rating,numOfRatings,BIN_TO_UUID(userId,true) as userId, BIN_TO_UUID(id,true) as id
        FROM landlord
        WHERE userId = UUID_TO_BIN(?,true)
    `;
    const data = [userId];
    const [rows,fields] = await db.query(sql,data);
    return (rows.length > 0 ? rows[0] : null);
}

/********************************************************************* 
 * getByLandlordId
 * Searches for a landlord by their landlord id
 * Returns a landlord profile
 ********************************************************************/
const getByLandlordId = async function(id){
    const sql = `
        SELECT rating,numOfRatings,BIN_TO_UUID(userId,true) as userId, BIN_TO_UUID(id,true) as id
        FROM landlord
        WHERE id = UUID_TO_BIN(?,true)
    `;
    const data = [id];
    const [rows,fields] = await db.query(sql,data);
    return (rows.length > 0 ? rows[0] : null);
}

/********************************************************************* 
 * createLandlordUser
 * Inserts a new landlord user into the database
 * Returns the id of the new landlord user
 ********************************************************************/
const createNewLandlordUser = async function(userId) {
    const id = uuid();
    const sql = `
        INSERT INTO
        landlord(id,userId,rating,numOfRatings)
        VALUES(UUID_TO_BIN(?, true),UUID_TO_BIN(?, true), 0, 0)
    `;
    const data = [id,userId];

    const [rows,fields] = await db.query(sql,data);
    return (rows.affectedRows ? id : null)
}

module.exports = {
    getByLandlordId,
    getByUserId,
    createNewLandlordUser
};