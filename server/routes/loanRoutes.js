const express = require('express');
const loanController = require('../controllers/loanController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/request', restrictTo('member', 'admin', 'secretary', 'treasurer'), loanController.requestLoan);

router.get('/my-loans', loanController.getMyLoans);

router.get('/group-loans', restrictTo('admin', 'secretary', 'treasurer'), loanController.getGroupLoans);
router.patch('/:id/sign', restrictTo('secretary', 'treasurer'), loanController.signLoan);
router.patch('/:id/repay', restrictTo('admin', 'secretary', 'treasurer'), loanController.repayLoan);
router.patch('/:id/status', restrictTo('admin', 'secretary'), loanController.updateLoanStatus);

module.exports = router;
