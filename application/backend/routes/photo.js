const express = require('express');
const router = express.Router();
const PhotoController = require('../controllers/photo');

router.post('/upload', PhotoController.uploadPhoto);
router.get('/getByListingId', PhotoController.getByListingId)

module.exports = router;