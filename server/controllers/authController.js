const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

// Explicitly include (req, res, next)
exports.register = asyncHandler(async (req, res, next) => {
    const { token, user } = await authService.register(req.body);
    
    res.status(201).json({
        status: 'success',
        token,
        data: { user }
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { token, user } = await authService.login(req.body.phone, req.body.password);
    
    res.status(200).json({
        status: 'success',
        token,
        data: { user }
    });
});


exports.getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});