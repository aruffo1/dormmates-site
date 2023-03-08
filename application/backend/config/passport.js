/********************************************************************* 
 * Passport is an authentication middleware for Node that handles
 * authenticating requests 
 ********************************************************************/
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const Student = require('../models/student');
const Landlord = require('../models/landlord');
const { comparePassword } = require("../config/bcrypt");

// Using the local strategy for passport.
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    var user = await User.getByUsername(username);

    if (!user) {
      return cb(null, false);
    }

    var passwordsMatch = await comparePassword(password, user.password);

    if (passwordsMatch) {
      return cb(null, user);
    }
    return cb(null, false);
  }),
);

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser(async (session, cb) => {
  var user = await User.getByUserId(session.uuid);
  if (!user) {
    return cb(null, false);
  }

  // Get a user's student or landlord profile.
  var student = await Student.getByUserId(user.uuid);
  var landlord = await Landlord.getByUserId(user.uuid);
  if(student) {
    user.student = student;
  } else if (landlord) {
    user.landlord = landlord;
  }

  return cb(null, user);
});

module.exports = passport;
