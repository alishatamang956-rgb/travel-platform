const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const reviewController = require('../controllers/reviewController');

router.get('/place/:placeId', reviewController.getForPlace); // public
router.post('/', authenticate, reviewController.submit);
router.post('/:id/photos', authenticate, upload.single('file'), reviewController.uploadPhoto);

module.exports = router;
