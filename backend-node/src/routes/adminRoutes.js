const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Every route below requires a logged-in ADMIN.
router.use(authenticate, authorize('ADMIN'));

router.get('/places/pending', adminController.pendingPlaces);
router.patch('/places/:id/approve', adminController.approvePlace);
router.patch('/places/:id/reject', adminController.rejectPlace);
router.patch('/places/:id/feature', adminController.featurePlace);
router.delete('/places/:id', adminController.deletePlace);

router.get('/reviews/pending', adminController.pendingReviews);
router.patch('/reviews/:id/approve', adminController.approveReview);
router.patch('/reviews/:id/reject', adminController.rejectReview);

router.get('/analytics', adminController.analytics);

module.exports = router;
