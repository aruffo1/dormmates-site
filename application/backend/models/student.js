const db = require('../config/database').pool;
const uuid = require('../utils/uuid');

/********************************************************************* 
 * getByUserId
 * Searches for a student by their user id
 * Returns a student profile
 ********************************************************************/
 const getByUserId = async function(userId){
    const sql = `
        SELECT
            BIN_TO_UUID(student.userId,true) as userId, 
            BIN_TO_UUID(student.id,true) as id,
            institution.institutionLatitude,
            institution.institutionLongitude,
            institution.name as institutionName,
            institution.id as institutionID,
            student.major,
            student.personality,
            student.schedule,
            student.hobby1,
            student.hobby2
        FROM student
        INNER JOIN institution ON student.institutionID = institution.id
        WHERE userId = UUID_TO_BIN(?,true)
    `;
    const data = [userId];
    const [rows,fields] = await db.query(sql,data);
    return (rows.length > 0 ? rows[0] : null);
}


/********************************************************************* 
 * getByStudentId
 * Searches for a student by their student id
 * Returns a student profile
 ********************************************************************/
const getByStudentId = async function(id){
    const sql = `
        SELECT
            BIN_TO_UUID(student.userId,true) as userId, 
            BIN_TO_UUID(student.id,true) as id,
            institution.institutionLatitude,
            institution.institutionLongitude,
            institution.name as institutionName,
            student.major,
            student.personality,
            student.schedule,
            student.hobby1,
            student.hobby2
        FROM student
        INNER JOIN institution ON student.institutionID = institution.id
        FROM student
        WHERE id = UUID_TO_BIN(?,true)
    `;
    const data = [id];
    const [rows,fields] = await db.query(sql,data);
    return (rows.length > 0 ? rows[0] : null);
}

/********************************************************************* 
 * createStudentUser
 * Inserts a new student user into the database
 * Returns the id of the new student user
 ********************************************************************/
const createNewStudentUser = async function(userId, universityId, major, personality, schedule, hobby1, hobby2) {
    const id = uuid();
    const sql = `
        INSERT INTO
        student(id,userId,institutionID,major,personality,schedule,hobby1,hobby2)
        VALUES(UUID_TO_BIN(?, true),UUID_TO_BIN(?, true),?,?,?,?,?,?)
    `;
    const data = [id,userId,universityId,major,personality,schedule,hobby1,hobby2];

    const [rows,fields] = await db.query(sql,data);
    return (rows.affectedRows ? id : null)
}

/********************************************************************* 
 * editStudentUser
 * Edits a students Major, Personality,Schedule,Hobby1,Hobby2 in the Database
 * Returns the id of the Edited Student User
 ********************************************************************/
const editStudentUser = async function(studentId,major,personality,hobby1,hobby2,schedule){

    const sql = `
        UPDATE student 
        SET major = ?,
        personality = ?,
        hobby1 = ?,
        hobby2 = ?,
        schedule = ?
        WHERE id = UUID_TO_BIN(?,true)`;

        const data = [major,personality,
            hobby1,hobby2,schedule,studentId];
        const [rows,fields] = await db.query(sql,data);

        if (rows.affectedRows !==1){
            throw new Error('Failed to update the Student');
           // return false;
        } else {
             return {studentId,
                    major,
                    personality,
                    hobby1,
                    hobby2,
                    schedule
             }
        }
}

/********************************************************************* 
 * editUser
 * Edits a Users Name, Emailaddress, Password, Birthday,Gender,Avatar
 * Returns the id of the edited User
 ********************************************************************/

//const editUser = async function(userId,name,emailAddress,password,dob,gender,photo){};
module.exports = {
    getByStudentId,
    getByUserId,
    createNewStudentUser,
    editStudentUser
};