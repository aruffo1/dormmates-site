const db = require('../config/database').pool;
const User = require('../models/user');
const Listing = require('../models/listing');
    


const getId = async function(){
    
}

const createNewLease = async function(listingId,studentId,contract,startedAt,endedAt){
 
    const sql = `
    INSERT INTO 
    lease(id,listingId,studentId,contract,startedAt,endedAt)
    VALUES(id,UUID_TO_BIN(?,true),UUID_TO_BIN(?,true),
            ?,?,?) 
        `


    const data = [listingId,studentId,contract,startedAt,endedAt];

    const [rows,fields] = await db.query(sql,data);

    if(rows.affectedRows !== 1) {
        throw new Error('Failed to add the Lease');
    } else {
        return 
            (rows.affectedRows ? listingId : null)
        
       }
}

const hasLease = async function(studentId){

    const sql = `
    SELECT *, id
    FROM lease
    WHERE studentId = UUID_TO_BIN(?,true)
    
    `;

    const data = [studentId];
    const [rows,fields] = await db.query(sql,data);

    console.log(rows.length);
    return(rows.length > 0 ? true : false);


}


module.exports = {createNewLease,
                  hasLease}