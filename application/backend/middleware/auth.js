const User = require('../models/user');

// Middleware that allows a request to continue if the user is logged in
const isAuthenticated = async (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.status(200).json({
      error: 'Unauthorized',
      message: 'You do not have permission to access this route.'
    })
  }
}

// Middleware that allows a request to continue if a user is not logged in
const isNotAuthenticated = async (req, res, next) => {
  if(!req.user) {
    next();
  } else {
    res.status(200).json({
      error: 'Unauthorized',
      message: 'You do not have permission to access this route.'
    })
  }
}

// Middleware that only allows a request to continue if the user is logged in
// and has a student profile.
const isStudent = async (req, res, next) => {
  // If the user is not authenticated, return an error.
  if(!req.user.student) {
    return res.status(200).json({
      error: 'Unauthorized',
      message: 'You do not have permission to access this route.'
    });
  }

  // Allowing the request to continue if user is a student.
  next();
}

// Middleware that only allows a request to continue if the user is logged in
// and has a landlord profile.
const isLandlord = async (req, res, next) => {
  // If the user is not authenticated, return an error.
  if(!req.user.landlord) {
    return res.status(200).json({
      error: 'Unauthorized',
      message: 'You do not have permission to access this route.'
    });
  }

  // Allowing the request to continue if user is a landlord.
  next();
}


module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isStudent,
  isLandlord,
}