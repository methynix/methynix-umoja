const Joi = require('joi');
const AppError = require('../utils/AppError');

const registerSchema = Joi.object({
    name: Joi.string().required().messages({ 'any.required': 'Jina lako ni lazima' }),
    phone: Joi.string().length(10).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
        'any.only': 'Password hazifanani'
    }),
    groupCode: Joi.string().required().messages({ 'any.required': 'Code ya kikundi ni lazima' }),
    
    groupName: Joi.string().required().messages({ 'any.required': 'Jina la kikundi ni lazima' }),

    type: Joi.string().valid('vicoba', 'chama').default('vicoba'),
    shareValue: Joi.number().min(0).optional().allow('', null),
    otp: Joi.string().length(6).required().messages({ 'any.required': 'Nambari ya OTP inahitajika', 'string.length': 'OTP lazima iwe tarakimu 6' })
});

const loginSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
    groupCode: Joi.string().allow('', null).optional()
});

const passwordResetRequestSchema = Joi.object({
    phone: Joi.string().length(10).required().messages({ 'any.required': 'Namba ya simu inahitajika' }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email inahitajika',
        'string.email': 'Weka email sahihi',
    }),
});

const passwordResetVerifySchema = Joi.object({
    phone: Joi.string().length(10).required(),
    otp: Joi.string().length(6).required().messages({ 'string.length': 'OTP lazima iwe tarakimu 6' }),
});

const passwordResetConfirmSchema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
        'any.only': 'Password hazifanani'
    }),
});

const memberApproveSchema = Joi.object({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
        'any.only': 'Password hazifanani'
    }),
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        return next(new AppError(message, 400));
    }
    next();
};

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validatePasswordResetRequest: validate(passwordResetRequestSchema),
    validatePasswordResetVerify: validate(passwordResetVerifySchema),
    validatePasswordResetConfirm: validate(passwordResetConfirmSchema),
    validateMemberApprove: validate(memberApproveSchema),
};