const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const placeController = require('../controllers/placeController');

// Public browsing — no login required
router.get('/', placeController.search);
router.get('/featured', placeController.featured);
router.get('/:id', placeController.getOne);

// Requires login
router.post('/', authenticate, placeController.create);
router.put('/:id', authenticate, placeController.update);
router.post('/:id/photos', authenticate, upload.single('file'), placeController.uploadPhoto);

module.exports = router;
