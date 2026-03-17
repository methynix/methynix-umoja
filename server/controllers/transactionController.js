const transactionService = require('../services/transactionService');
const asyncHandler = require('../utils/asyncHandler');

exports.getMyHistory = asyncHandler(async (req, res, next) => {
    const transactions = await transactionService.getMemberHistory(req.user._id);
    
    res.status(200).json({
        status: 'success',
        data: { transactions }
    });
});

exports.recordContribution = asyncHandler(async (req, res, next) => {
    const transaction = await transactionService.recordContribution(req.user._id, req.body);
    
    res.status(201).json({
        status: 'success',
        data: { transaction }
    });
});