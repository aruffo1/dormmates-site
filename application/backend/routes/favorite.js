const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/favorite");
const { isAuthenticated, isStudent } = require("../middleware/auth");

router.get("/student/:studentId", (req, res, next) => {
  FavoriteController.getFavoriteList(req, res, next);
});

router.post("/listing", (req, res, next) => {
  FavoriteController.createFavorite(req, res, next);
});

router.delete("/delete/:studentId/:listingId", (req, res, next) => {
  FavoriteController.removeFavorite(req, res, next);
});


module.exports = router;
