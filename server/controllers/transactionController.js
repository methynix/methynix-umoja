const transactionService = require('../services/transactionService');
const asyncHandler = require('../utils/asyncHandler');
const Transaction=require('../models/Transaction')

exports.getMyHistory = asyncHandler(async (req, res, next) => {
    const transactions = await transactionService.getMemberHistory(req.user._id);
    
    res.status(200).json({
        status: 'success',
        data: { transactions }
    });
});


exports.getMyLedger = asyncHandler(async (req, res) => {
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const transactions = await Transaction.find({
        member: req.user._id,
        year: currentYear
    });

    const ledger = months.map((m, index) => {
        const shareRec = transactions.find(t => t.month === (index + 1) && t.type === 'share');

        const socialRec = transactions.find(t => t.month === (index + 1) && t.type === 'social_fund');

        return {
            month: m,
            shareAmount: shareRec ? shareRec.amount : 0,
            socialAmount: socialRec ? socialRec.amount : 0,
            status: shareRec ? 'Paid' : (index < new Date().getMonth() ? 'Not Paid' : 'Pending')
        };
    });

    res.status(200).json({ status: 'success', data: { ledger } });
});
exports.recordContribution = asyncHandler(async (req, res, next) => {
    const transaction = await transactionService.recordContribution(req.user._id, req.body);
    
    res.status(201).json({
        status: 'success',
        data: { transaction }
    });
});