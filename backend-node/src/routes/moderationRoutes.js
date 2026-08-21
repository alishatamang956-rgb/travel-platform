const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const moderationController = require('../controllers/moderationController');

// Admins AND trusted moderators can use these.
router.use(authenticate, authorize('ADMIN', 'MODERATOR'));

router.get('/reviews/flagged', moderationController.flagged);
router.patch('/reviews/:id/flag', moderationController.flag);
router.patch('/reviews/:id/verify', moderationController.verify);

module.exports = router;
