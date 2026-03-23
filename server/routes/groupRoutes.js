const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('superadmin'), groupController.getAllGroups);

module.exports = router;