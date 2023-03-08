const User = require('../models/user');
const Student = require('../models/student');
const Landlord = require('../models/landlord');
const Institution = require('../models/institution');
const { hashPassword } = require('../config/bcrypt');

// ----------------------------------------------------------------
// This function takes in a request body and creates a new user.
// Returns:
//      200 if successful, 400 if something went wrong
//      JSON with a message field
// ----------------------------------------------------------------
const createUser = async function (req, res, next) {
  // Validating registration form
  const bodyValidated = await validateRegistrationBody(req, res, next);
  if(bodyValidated === true) {
    await registerNewUser(req, res, next);
  }
};

const createStudent = async function (req, res, next) {
  // Validating questionnaire form
  const bodyValidated = await validateQuestionnaireBody(req, res, next);
  if(bodyValidated === true) {
    await registerNewStudent(req, res, next);
  }
}

const getUser = async (req, res, next) => {
  const id = req.params.id;
  if(!id) {
    return res.status(200).send({
      error: 'Could not get user',
      message: 'Please provide a valid user id',
    });
  }

  try {
    var user = await User.getByUserId(id);
    if(!user) {
      return res.status(200).send({
        error: 'Could not get user',
        message: 'User not found',
      });
    }

    var student = await Student.getByUserId(id);
    var landlord = await Landlord.getByUserId(id);

    if(student) {
      user.student = student;
    } else {
      user.landlord = landlord;
    }

    return res.status(200).send({
      error: null,
      message: 'User found',
      user,
    });
  } catch(e) {
    return res.status(200).send({
      error: 'Could not get user',
      message: 'An error occurred',
    });
  }
}

const editStudent = async function (req, res, next){

const studentId = req.body.studentId;
const major = req.body.major;
const personality = req.body.personality;
const schedule = req.body.schedule;
const hobby1 = req.body.hobby1;
const hobby2 = req.body.hobby2;

//Error checking for data. 


const student = await Student.editStudentUser(studentId,major,personality,
  hobby1,hobby2,schedule);

  if(!student){
    return res.status(400).send({
      error: "Student was not Updated"
    });

  } else {
    return res.status(200).json({
      message: "Student Successfully Updated",
      student: student
    });
  }



}


// ----------------------------------------------------------------
// 
// HELPER FUNCTIONS
// 
// ----------------------------------------------------------------

const validateRegistrationBody = async function(req, res, next) {
  // Get the user data from the request
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { name } = req.body;
  const { dob } = req.body;
  const { gender } = req.body;
  const { avatar } = req.body;
  const { type } = req.body;

  // Validate the user data
  if (!username || !email || !password || !name || !dob || !gender || !type || !avatar) {
    return res.status(200).send({
      error: 'Form is incomplete',
      message: 'Please fill in all required fields',
    });
  }

  // Check if the email is a valid email
  if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
    return res.status(200).send({
      error: 'Email address does not meet requirements',
      message: 'Please enter a valid email address',
    });
  }

  // Check if the password is at least 8 characters long and contains at least
  // one uppercase letter and one number
  if (!password.length >= 8 || !password.match(/([A-Z])/)) {
    return res.status(200).send({
      error: 'Password does not meet requirements',
      message:
        'Please enter a password with at least 8 characters, one uppercase letter and one number',
    });
  }

  // Check if the user is at least 18 years old
  const dobDate = new Date(dob);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - dobDate.getFullYear();
  if (age < 18) {
    return res.status(200).send({
      message: 'You must be at least 18 years old to register',
    });
  }

  // Check if the user type is of landlord or student
  if (type.toLowerCase() != 'landlord' && type.toLowerCase() != 'student') {
    return res.status(200).send({
      error: 'User type is invalid',
      message: 'Please select a valid user type (student or landlord)',
    });
  }


  try {
    // Validating if the username is unique
    const usernameIsUnique = await User.getByUsername(username);
    if (usernameIsUnique) {
      return res.status(200).send({
        error: 'Could not create an account with that username.',
        message: 'Username is taken.',
      });
    }

    // Validating if the email is unique
    const emailIsUnique = await User.getByEmail(email);
    if (emailIsUnique) {
      return res.status(200).send({
        error: 'Could not create an account with that email.',
        message: 'Email is taken.',
      });
    }
  } catch (e) {
    return res.status(200).send({
      error: 'Could not create a new user.',
    });
  }

  return true;
}

const validateQuestionnaireBody = async function(req, res, next) {
  // Get the user data from the request
  const { major } = req.body;
  const { personality } = req.body;
  const { schedule } = req.body;
  const { hobby1 } = req.body;
  // const { hobby2 } = req.body;

  // Validate the user data
  // if (!major || !personality || !schedule || !hobby1 || !hobby2) {
  if (!major || !personality || !schedule || !hobby1) {
    return res.status(200).send({
      error: 'Form is incomplete',
      message: 'Please fill in all required fields',
    });
  }

  return true;
}

// const convertToBase64 = (image) => new Promise((resolve, reject) => {
//   const reader = new FileReader()
//   reader.onload = () => resolve(reader.result)
//   reader.onerror = error => reject(error)
//   reader.readAsDataURL(image)
// });

// Helper function for registering a new user
const registerNewUser = async function(req, res, next) {
  // Get the user data from the request
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { name } = req.body;
  const { dob } = req.body;
  const { gender } = req.body;
  const { avatar } = req.body;
  const { type } = req.body;

  try {
    // Check if the user goes to a university that we support
    if (type.toLowerCase() === 'student') {
      const domain = (email.split('@')[1]).toLowerCase();
      var institution = await Institution.getByDomain(domain);
      if (!institution) {
        return res.status(200).send({
          error: 'University is not supported',
          message: 'Sorry, we currently only support universities in Northern California.',
        });
      }
    }

    // Hashing the password and creating the user
    const hashedPassword = await hashPassword(password);
    const userCreated = await User.createNewUser(
      username,
      email,
      hashedPassword,
      name,
      dob,
      gender,
      avatar
    );

    if (userCreated) {
      // Create a landlord user if the user was successfully created
      if (type.toLowerCase() === 'landlord') {
        await Landlord.createNewLandlordUser(userCreated);
      }

      return res.status(200).send({
        error: null,
        message: 'User Created',
        id: userCreated,
      });
    }

    // If the user was not created, return an error
    return res.status(200).send({
      error: 'Could not create a new user.',
      message: 'User not created',
    });
    
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      error: 'Could not create a new user.',
      message: 'User not created',
    });
  }
}

// Helper function for registering a new user
const registerNewStudent = async function(req, res, next) {
  // Get the user data from the request
  const { id } = req.body;
  const { major } = req.body;
  const { personality } = req.body;
  const { schedule } = req.body;
  const { hobby1 } = req.body;
  const { hobby2 } = req.body;

  try {
    // Check if the user can create a student profile
    const user = await User.getByUserId(id);
    if (!user) {
      return res.status(200).send({
        error: 'User does not exist',
        message: 'User does not exist',
      });
    } else if (!user.emailAddress.includes('.edu')) {
      return res.status(200).send({
        error: 'User is not a student',
        message: 'User is not a student, cannot create student profile.',
      });
    }

    const student = await Student.getByUserId(id);
    if (student) {
      return res.status(200).send({
        error: 'User already has a student profile',
        message: 'Could not create profile.',
      });
    }

    // Get the student's institution
    const domain = (user.emailAddress.split('@')[1]).toLowerCase();
    var institution = await Institution.getByDomain(domain);
    if (!institution) {
      return res.status(200).send({
        error: 'University is not supported',
        message: 'Sorry, we currently only support universities in Northern California.',
      });
    }

    // Attempt to create a stuednt profile
    const studentCreated = await Student.createNewStudentUser(
      id,
      institution.id,
      major,
      personality,
      schedule,
      hobby1,
      hobby2
    );

    if (studentCreated) {
      return res.status(200).send({
        error: null,
        message: 'Student Created'
      });
    }

    // If the user was not created, return an error
    return res.status(200).send({
      error: 'Could not create a new user.',
      message: 'User not created',
    });
    
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      error: 'Could not create a new user.',
      message: 'User not created',
    });
  }
}

module.exports = {
  createUser,
  createStudent,
  getUser,
  editStudent
}
