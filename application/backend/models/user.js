const db = require('../config/database').pool;
const uuid = require('../utils/uuid');

/********************************************************************* 
 * getByEmail queries the database to find rows in the 
 * users table that have the matching email
 * Returns a user 
 ********************************************************************/

const getByEmail = async function (email) {
    const sql = ` 
        SELECT BIN_TO_UUID(id, true) AS uuid, username, emailAddress, password, name, birthdate, lastSeen, photo, verified, gender
        FROM user
        WHERE emailAddress = ?
    `;
    const data = [email];

    //Query database then returns a user
    const [users, fields] = await db.query(sql, data);

    return (users.length > 0 ? users[0] : null)
}

/********************************************************************* 
 * getByUsername queries the database to find rows in the 
 * users table that have the matching username
 * Returns a user 
 ********************************************************************/

const getByUsername = async function (username) {
    const sql = ` 
        SELECT BIN_TO_UUID(id, true) AS uuid, username, emailAddress, password, name, birthdate, lastSeen, photo, verified, gender
        FROM user
        WHERE username = ?
    `;
    const data = [username];

    //Query database and returns a user
    const [users, fields] = await db.query(sql, data);
    return (users.length > 0 ? users[0] : null)

}

/********************************************************************* 
 * getById queries the database to find rows in the 
 * users table that have the matching id
 * Returns a user 
 ********************************************************************/

const getByUserId = async function (userId) {
    const sql = ` 
        SELECT BIN_TO_UUID(id, true) AS uuid, username, emailAddress, password, name, birthdate, lastSeen, photo, verified, gender
        FROM user
        WHERE id = UUID_TO_BIN(?, true)
    `;
    const data = [userId];

    //Query database then returns a user
    const [users, fields] = await db.query(sql, data);
    return (users.length > 0 ? users[0] : null)

}

/********************************************************************* 
 * createNewUser
 * Inserts a new user into the database
 * Returns the id of the new user
 ********************************************************************/

const createNewUser = async function(username,email,password,name,dob,gender, avatar){
    const id = uuid();
    const sql = `
        INSERT INTO 
        user(id,username,emailAddress,password,name,birthdate,gender, photo, lastSeen)
        VALUES(UUID_TO_BIN(?, true),?,?,?,?,?,?,?,NOW())
    `;
    const data = [id,username,email,password,name,dob,gender, avatar];

    // Insert new user into the database
    const [rows,fields] = await db.query(sql,data);
    return (rows.affectedRows ? id : null)
}

module.exports = {
    getByEmail,
    getByUsername,
    getByUserId,
    createNewUser,
}