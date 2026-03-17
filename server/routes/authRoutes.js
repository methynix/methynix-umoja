const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../validators/userValidator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;