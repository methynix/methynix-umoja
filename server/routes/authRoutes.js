const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../validators/userValidator');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Majaribio mengi sana. Jaribu tena baada ya dakika 15.' },
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Umevuka kikomo cha OTP. Jaribu tena baadaye.' },
});

router.post('/otp/request', otpLimiter, authController.requestOTP);
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.patch('/update-password', protect, authController.updatePassword);

module.exports = router;