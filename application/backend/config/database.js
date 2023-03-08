require('dotenv').config();

// get the client
const mysql = require('mysql2');
 
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE_NAME,
  password: process.env.DB_PASS,
  connectionLimit: 50,
  debug: false
});

module.exports = {
  pool: pool.promise()
}