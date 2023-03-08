const db = require('../config/database').pool;
const uuid = require('../utils/uuid');
const User = require('./user');

const getAllListing = async function () {

    const sql = `
    SELECT * FROM listing

    `;

   const [listings,fields] = await db.query(sql);

   return listings;
};

const getListingById = async function(id) {
    const sql = `
        SELECT
            BIN_TO_UUID(listing.id,true) as id,
            BIN_TO_UUID(landlord.id,true) as landlordId,
            listing.price,
            listing.description,
            listing.location,
            listing.verification,
            listing.availability,
            listing.listingLatitude,
            listing.listingLongitude,
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
            amenities.parking,
            BIN_TO_UUID(user.id, true) as landlordUserId,
            user.name as landlordName,
            user.photo as landlordPhoto
        FROM listing
        INNER JOIN amenities ON amenities.listingId = listing.id
        INNER JOIN landlord on landlord.id = listing.landlordId
        INNER JOIN user on user.id = landlord.userId
        WHERE listing.id = UUID_TO_BIN(?,true)
    `;
    const [listing,fields] = await db.query(sql,id);
    return (listing.length > 0 ? listing[0] : null);
}

const getListingsByLandlordId = async function(landlordId) {
    const sql = `
        SELECT
            BIN_TO_UUID(listing.id,true) as id,
            listing.price,
            listing.description,
            listing.location,
            listing.verification,
            listing.availability,
            listing.listingLatitude,
            listing.listingLongitude,
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
            amenities.parking,
            BIN_TO_UUID(user.id, true) as landlordUserId,
            user.name as landlordName,
            user.photo as landlordPhoto
        FROM listing
        INNER JOIN amenities ON amenities.listingId = listing.id
        INNER JOIN landlord on landlord.id = listing.landlordId
        INNER JOIN user on user.id = landlord.userId
        WHERE listing.landlordId = UUID_TO_BIN(?,true)
    `;
    const [listings,fields] = await db.query(sql,landlordId);
    return (listings.length > 0 ? listings : null);
}


//Creates a new listing
const createNewListing = async function (landlordId, price, location, description, verification, availability,latitude,longitude) {
    const id = uuid();

    const sql = `
        INSERT INTO
        listing(id,landlordId,price,location,description,verification,availability,listingLatitude,listingLongitude)
        VALUES(UUID_TO_BIN(?, true),UUID_TO_BIN(?, true),?,?,?,?,?,?,?)
    `;


    const data = [id, landlordId, price, location, description, verification, availability,latitude,longitude];

    const [rows, fields] = await db.query(sql, data);
    if (rows.affectedRows !== 1) {
        throw new Error('Failed to create new listing');
    } else {
        return {
            landlordId,
            price,
            location,
            description,
            verification,
            availability,
            id,
            latitude,longitude
        }
    }
}

const getLocation = async function (listingId){

    const sql = `
    SELECT listingLatitude,listingLongitude FROM listing
    WHERE id = UUID_TO_BIN(?,true) 
    `;
    //console.log(listingId);
    const data = [listingId];
    const [listing,fields] = await db.query(sql,data);
    return(listing.length > 0 ? listing[0] : null);

}


const removeListing = async function(listingId){

    const sql = `
        DELETE FROM listing
        WHERE id = UUID_TO_BIN(?,true)
        `;

    const data = listingId;
    const [rows,fields] = await db.query(sql,data);

    
    if (rows.affectedRows !== 1) {
        throw new Error('Failed to delete listing');
        
}
}

const editedAmenities = async function(listingId, washer,dryer,
    wifi,closet,furnished,kitchen,whiteboard,bath,livingroom,patio,parking){
//console.log(listingId);
// //, amenities.washer = ?, amenities.dryer = ?, amenities.wifi = ?, ame'
// const sqlUpdate = 'UPDATE amenities '
// const sqlSet = 'SET listing.price = ?, listing.description = ?, listing.availability = ? '
// const sqlAmenities = Object.keys(amenities).map(k => `amenities.${k} = ?`).join(', ')
// const sqlWhere = 'WHERE amenities.lisitingId = UUID_TO_BIN(?,true)'
// const [listings, fields] = await db.query(`${sqlUpdate}${sqlJoin}${sqlSet}${sqlAmenities}${sqlWhere}`, Object.values(amenities))
const sql = `
    UPDATE amenities 
    SET washer = ?,
     dryer = ?,
     wifi = ?,
     closet = ?,
     furnished = ?,
     kitchen = ?,
     whiteboard = ?,
     bath = ?,
     livingroom = ?,
     patio = ?,
     parking = ?
    WHERE listingId = UUID_TO_BIN(?,true)
`;

console.log(listingId);
const data = [washer,dryer,wifi,closet,furnished,kitchen,whiteboard,bath,
livingroom,patio,parking,listingId];

 const [rows,fields] = await db.query(sql,data);


 if (rows.affectedRows !==1){
    throw new Error('Failed to Edit the listing');
}
}


const editListing = async function(listingId,price,description,availability){

    const sql = `
        UPDATE listing SET price = ?, description = ?, availability = ?
        WHERE id = UUID_TO_BIN(?,true)
    `;

    const data = [price,description,availability,listingId];
    const [rows,fields] = await db.query(sql,data);

    console.log(rows);
    if (rows.affectedRows !==1){
        throw new Error('Failed to Edit the listing');
    }

}

const verifyListing = async function(listingId,verification){


    const sql = `
    UPDATE listing SET verification = ?
    WHERE id = UUID_TO_BIN(?,true)
    `;

    console.log(verification);
    const data = [verification,listingId];
    const [rows,fields] = await db.query(sql,data);

    if(rows.affectedRows !==1){
        throw new Error("Failed to verify listing")
    } 
    
}
// // const changePrice = async function(newPrice){
//     const editAmenities = async function(listingId,verification){


//         const sql = `
//         UPDATE amenities 
//         SET 
//         washer = ?, 
//         dryer = ?, 
//         wifi = ?, 
//         closet = ?,

//         WHERE id = UUID_TO_BIN(?,true)
//         `;
    
//         console.log(verification);
//         const data = [verification,listingId];
//         const [rows,fields] = await db.query(sql,data);
    
//         if(rows.affectedRows !==1){
//             throw new Error("Failed to verify listing")
//         } 
        
//     }
// }

// const changeDescription = async function(newDescriptioni){

// }

module.exports = {
    createNewListing,
    removeListing,
    getLocation,
    getAllListing,
    editedAmenities,
    editListing,
    verifyListing,
    getListingById,
    getListingsByLandlordId,
};