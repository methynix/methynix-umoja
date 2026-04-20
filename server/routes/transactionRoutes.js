const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/record', restrictTo('admin', 'secretary', 'superadmin'), transactionController.recordContribution);
router.get('/my-ledger', transactionController.getMyLedger);
router.get('/my-history', transactionController.getMyHistory);

module.exports = router;