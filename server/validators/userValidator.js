const Joi = require('joi');
const AppError = require('../utils/AppError');

const registerSchema = Joi.object({
    name: Joi.string().required().messages({ 'any.required': 'Jina ni lazima' }),
    phone: Joi.string().length(10).required().messages({ 
        'string.length': 'Namba ya simu lazima iwe na tarakimu 10' 
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password lazima iwe na herufi kuanzia 6'
    }),
    
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Password hazifanani (Passwords do not match)' }),

    role: Joi.string().valid('member', 'secretary', 'admin').default('member'),
    groupCode: Joi.string().allow('', null)
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