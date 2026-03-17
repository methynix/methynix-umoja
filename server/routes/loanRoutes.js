const express = require('express');
const loanController = require('../controllers/loanController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect); // Kinga zote

router.post('/request', loanController.requestLoan);
router.get('/my-loans', loanController.getMyLoans);

module.exports = router;