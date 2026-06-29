const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/maintenance', protect, settingsController.getMaintenanceStatus);
router.post('/maintenance', protect, restrictTo('superadmin'), settingsController.toggleMaintenance);

module.exports = router;