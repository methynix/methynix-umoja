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
    
    // ONGEZA HII HAPA CHINI
    groupName: Joi.string().required().messages({ 'any.required': 'Jina la kikundi ni lazima' }),
    
    role: Joi.string().valid('member', 'admin', 'secretary', 'superadmin').default('member')
});

const loginSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
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
    validateLogin: validate(loginSchema)
};