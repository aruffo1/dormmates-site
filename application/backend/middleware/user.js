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
  isStudent,
  isLandlord
}