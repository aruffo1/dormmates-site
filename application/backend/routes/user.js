const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");


//To edit a student user profile
router.put("/student", (req, res, next) => {

    UserController.editStudent(req,res,next);
});

router.put("/general", (req, res, next) => {


});
module.exports = router;