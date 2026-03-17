const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

// Scoped access
router.get('/members', restrictTo('superadmin', 'admin', 'secretary'), userController.getAllMembers);
router.post('/members', restrictTo('superadmin', 'admin', 'secretary'), userController.createMember);

module.exports = router;