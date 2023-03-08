const db = require('../config/database').pool;
// const listing = require('../models/listing')

// getInstitutionsByName queries the database to find all rows in the
// institution table which have the keyword string in their name.
// Returns an array of institutions.
const getInstitutionsByName = async function (keyword) {
  // Construct sql query to find institutions by keyword
  const sql = `
    SELECT *
    FROM institution
    WHERE name LIKE ?
  `;
  // Construct data to be passed to sql query
  const data = [`%${keyword}%`];

  // Query database and return instiutions
  const [institutions, fields] = await db.query(sql, data);
  return institutions
}

// getListingByAmenities queries the database to find all rows in the
// listing table which have the attributes chosen by a user.
// Returns an array of listings.
const getListingsByAmenities = async function (amenities) {
  if (!(Object.values(amenities).length === 0)) {
    const sqlPrepend = 'SELECT BIN_TO_UUID(listing.id,true) as id, BIN_TO_UUID(listing.landlordID) as landlordID, listing.price, listing.location, listing.listingLongitude, listing.listingLatitude, listing.description, listing.verification, listing.availability FROM amenities'
    const sqlJoin = ' INNER JOIN listing ON listing.id = amenities.listingId WHERE '
    const sqlAmenities = Object.keys(amenities).map(k => `amenities.${k} = ?`).join(' AND ')
    // Query the database and return listings
    const [listings, fields] = await db.query(`${sqlPrepend}${sqlJoin}${sqlAmenities}`, Object.values(amenities));
    return listings;
  }
  const sql = `
  SELECT
   BIN_TO_UUID(listing.id,true) as id,
   BIN_TO_UUID(landlordID,true) as landlordID, 
   price,
   listingLongitude,
   listingLatitude,
   description, 
   verification, 
   availability,
   location
   FROM listing
   `;
  const [listings, fields] = await db.query(sql);
  return listings;
};

/************************************************************************
 * This function queries the database to find all rows in the student
 * that match the given parameters chosen by the user.
 * Returns: an array of students
 ************************************************************************/


const getRoommatesByFiltering = async function (filters, institutionID, userID) {

  if (!(Object.values(filters).length === 0)) {
    const sqlPrepend = 'SELECT BIN_TO_UUID(student.id,true) AS studentId, BIN_TO_UUID(user.id,true) AS userId, institution.name AS institution, student.major, student.personality, student.hobby1, student.hobby2, student.schedule, user.username, user.emailAddress, user.name, user.birthdate, user.lastSeen, user.photo,user.verified, user.gender FROM student'
    const sqlJoin = ' INNER JOIN institution ON institution.id = student.institutionID INNER JOIN user ON user.id = student.userId WHERE '
    const sqlFilters = Object.keys(filters).map(k => `student.${k} = ?`).join(' AND ')
    const sqlWhere = ' AND student.institutionID = ? AND BIN_TO_UUID(student.userId,true) <> ?'
    // Query the database and return students
    const data = Object.values(filters);
    data.push(institutionID, userID);
    const [students, fields] = await db.query(`${sqlPrepend}${sqlJoin}${sqlFilters}${sqlWhere}`, data);
    return students;
  }
  const sql = `
    SELECT 
      BIN_TO_UUID(student.id,true) AS studentId,
      BIN_TO_UUID(user.id, true) AS userId,
      institution.name AS institution,
      student.major,
      student.personality,
      student.hobby1,
      student.hobby2,
      student.schedule,
      user.username, 
      user.emailAddress, 
      user.name, 
      user.birthdate, 
      user.lastSeen, 
      user.photo,
      user.verified, 
      user.gender
    FROM student
    INNER JOIN user ON user.id = student.userId
    INNER JOIN institution on institution.id = student.institutionID 
    WHERE student.institutionID = ? AND BIN_TO_UUID(student.userId,true) <> ?
  `;
  const data = [institutionID, userID]
  const [students, fields] = await db.query(sql, data);
  return students
}

/****************************************************************
 * This function queries the database to find at most 5 rows that 
 * have a matching institution as the user.
 * Returns: an array of students 
 ****************************************************************/
const getRoommatesRecomendations = async function (studentId) {
  const sql =
    `SELECT
  BIN_TO_UUID(user.id, true) as id,
  BIN_TO_UUID(student.id, true) as studentId,
  student.major,
  student.personality,
  student.hobby1,
  student.hobby2,
  student.schedule,
  user.name,
  user.lastSeen,
  user.photo,
  user.gender,
  institution.name as institution
  FROM student
  LEFT JOIN user ON user.id = student.userId
  INNER JOIN institution ON institution.id = student.institutionID
  WHERE
    BIN_TO_UUID(student.id, true) <> ? AND institution.id IN (
    SELECT student.institutionId
    FROM student
    WHERE BIN_TO_UUID(student.id, true) = ?
  )
  ORDER BY RAND()
  LIMIT  4
  `;

  const data = [studentId, studentId]

  const [students, fields] = await db.query(sql, data);
  return students;
}

module.exports = {
  getInstitutionsByName,
  getListingsByAmenities,
  getRoommatesByFiltering,
  getRoommatesRecomendations
}
