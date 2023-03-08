const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const UserController = require("../controllers/user");
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

router.post("/register", (req, res, next) => {  
  UserController.createUser(req, res, next);
});

router.post("/questionnaire", (req, res, next) => {
  UserController.createStudent(req, res, next);
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  return res.status(200).send({
    message: "Logged In!",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  return res.status(200).send({
    message: "Logged Out!",
  });
});



module.exports = router;
