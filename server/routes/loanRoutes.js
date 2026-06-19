const express = require('express');
const loanController = require('../controllers/loanController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);

// Members (incl. group admins/secretaries who are also savers) request loans.
// Superadmin is a platform manager and is blocked inside the controller.
router.post('/request', restrictTo('member', 'admin', 'secretary'), loanController.requestLoan);

router.get('/my-loans', loanController.getMyLoans);

// Group leaders see and act on their group's loan requests.
router.get('/group-loans', restrictTo('admin', 'secretary'), loanController.getGroupLoans);
router.patch('/:id/status', restrictTo('admin', 'secretary'), loanController.updateLoanStatus);

module.exports = router;
