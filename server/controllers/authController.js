const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');

exports.requestOTP = asyncHandler(async (req, res) => {
    const result = await authService.requestOTP(req.body.phone);
    res.status(200).json({ status: 'success', message: result.message });
});

exports.register = asyncHandler(async (req, res, next) => {
    const { token, user } = await authService.register(req.body);
    
    res.status(201).json({
        status: 'success',
        token,
        data: { user }
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { token, user } = await authService.login(req.body.phone, req.body.password, req.body.groupCode);
    
    res.status(200).json({
        status: 'success',
        token,
        data: { user }
    });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.correctPassword(oldPassword, user.password))) {
        return next(new AppError('Password ya sasa si sahihi', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password imebadilishwa'
    });
});


exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('groupId', 'name groupCode image shareValue type socialFundAmount mawazoAmount loanThreshold');

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});