const db = require('../config/database').pool;
const Listing = require('../models/listing');


//Function takes in a listingID and an amenities object.
const createAmenities = async function (listingId, amenities) {

    const sql = `
        INSERT INTO
        amenities(listingId,washer,dryer,wifi,closet,furnished,
                kitchen,whiteboard,bath,livingroom,patio,parking)
        VALUES(UUID_TO_BIN(?,true),?,?,?,?,?,?,?,?,?,?,?)
`


    const data = [
        listingId,
        amenities.washer,
        amenities.dryer,
        amenities.wifi,
        amenities.closet,
        amenities.furnished,
        amenities.kitchen,
        amenities.whiteboard,
        amenities.bath,
        amenities.livingroom,
        amenities.patio,
        amenities.parking
    ];

    const [rows, fields] = await db.query(sql, data);
    if (rows.affectedRows === 1) {
        return {
            listingId,
            ...amenities,
        }
    }
    throw new Error('unable to create amenities')
}

const deleteAmenities = async function(listingId){

    const sql = `
    DELETE FROM amenities
    WHERE listingId = UUID_TO_BIN(?,true)
    `;


}
module.exports = {
    createAmenities
}