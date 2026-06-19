const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

// Listing & creating members (scoped inside controller/service)
router.get('/members', restrictTo('superadmin', 'admin', 'secretary'), userController.getAllMembers);
router.post('/members', restrictTo('superadmin', 'admin', 'secretary'), userController.createMember);

// Deleting a member is an admin (group chairperson) action.
router.delete('/members/:id', restrictTo('admin', 'superadmin'), userController.deleteMember);

module.exports = router;
