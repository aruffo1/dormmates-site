const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const SearchController = require('../controllers/search');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// Find all institutions by name
router.get('/institution/:name', (req, res, next) => {
  SearchController.getInstitutions(req, res, next);
});

//Find all listings by amenities
router.get('/listing', (req,res,next) => {
  SearchController.getListingsByAmenities(req,res,next);
});
router.get('/student', (req,res,next) => {
  SearchController.getRoommateByFiltering(req,res,next);
});

router.get('/recommendations/:id', (req,res,next) => {
  SearchController.getRoommateRecomendations(req,res,next);
});

router.get('/user/:id', (req,res,next) => {
  UserController.getUser(req, res, next);
});

router.get('/location/:location', (req, res, next) => {
  SearchController.getLocationData(req, res, next);
});

module.exports = router