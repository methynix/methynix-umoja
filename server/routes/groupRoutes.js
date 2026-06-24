const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('superadmin'), groupController.getAllGroups);

router.get('/summary', protect, groupController.getSummary);
router.patch('/settings', protect, restrictTo('admin'), groupController.updateMyGroup);

router.get('/:id/members', protect, restrictTo('superadmin'), groupController.getGroupMembers);

module.exports = router;
