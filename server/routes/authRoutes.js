const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    validateRegister,
    validateLogin,
    validatePasswordResetRequest,
    validatePasswordResetVerify,
    validatePasswordResetConfirm,
    validateMemberApprove,
} = require('../validators/userValidator');
const rateLimit = require('express-rate-limit');

// Many members of a group often share one IP (office / home WiFi), so the
// login/register cap is set for a whole group, not a single person.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: { status: 'error', message: 'Majaribio mengi sana. Jaribu tena baada ya dakika 15.' },
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: { status: 'error', message: 'Umevuka kikomo cha OTP. Jaribu tena baadaye.' },
});

router.post('/otp/request', otpLimiter, authController.requestOTP);
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.patch('/update-password', protect, authController.updatePassword);

// Password reset via email
router.post('/password-reset/request', otpLimiter, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset/verify', otpLimiter, validatePasswordResetVerify, authController.verifyPasswordResetOTP);
router.post('/password-reset/confirm', authLimiter, validatePasswordResetConfirm, authController.confirmPasswordReset);

// Manually-added member verification (SMS link)
router.get('/verify-member/:token', authController.getMemberVerificationInfo);
router.post('/verify-member/:token/approve', authLimiter, validateMemberApprove, authController.approveMember);

module.exports = router;