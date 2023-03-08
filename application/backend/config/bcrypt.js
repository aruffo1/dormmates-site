const bcrypt = require('bcrypt');
const saltRounds = 10;

//Bcrypt for hashing password

const hashPassword = async function(password){

    return bcrypt.hash(password,saltRounds);

}

//Compare passwords using bcrypt
const comparePassword = async function(password,hash){

    return bcrypt.compare(password,hash)
 
}

module.exports = {
    hashPassword,
    comparePassword
}