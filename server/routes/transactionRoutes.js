const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/my-history', transactionController.getMyHistory);
router.get('/my-ledger', transactionController.getMyLedger);
// Ni Secretary na Admin tu wanaoweza kuingiza michango
router.post('/record', restrictTo('admin', 'secretary'), transactionController.recordContribution);

module.exports = router;