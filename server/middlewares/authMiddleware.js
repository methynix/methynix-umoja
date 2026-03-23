const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists and isn't the literal string "null" or "undefined"
    if (!token || token === 'null' || token === 'undefined') {
        return next(new AppError('Haujalogin. Tafadhali ingia upya.', 401));
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('Mwanachama mwenye token hii hayupo tena.', 401));
        }

        // Grant access
        req.user = currentUser;
        next();
    } catch (error) {
        console.log("JWT Error Details:", error.message); // Hii itakuambia kwanini imefeli kwenye console ya server
        
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Muda wa token umeisha. Ingia tena.', 401));
        }
        return next(new AppError(`Token si sahihi: ${error.message}`, 401));
    }
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
         if (req.user.role === 'superadmin') return next();
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Huna ruhusa ya kufanya kitendo hiki.', 403));
        }
        next();
    };
};