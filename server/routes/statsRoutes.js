const express = require('express');
const statsController = require('../controllers/statsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

// ONLY Superadmin can access these global platform numbers
router.get('/global', protect, restrictTo('superadmin'), statsController.getGlobalStats);

module.exports = router;