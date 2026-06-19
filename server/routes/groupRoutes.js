const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Superadmin browses groups, then drills into ONE group at a time to see its
// members. This avoids ever loading every user in the platform at once.
router.get('/', protect, restrictTo('superadmin'), groupController.getAllGroups);
router.get('/:id/members', protect, restrictTo('superadmin'), groupController.getGroupMembers);

module.exports = router;
