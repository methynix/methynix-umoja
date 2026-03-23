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
    const currentMonthNum = new Date().getMonth();

    // Vuta miamala ya mwaka huu pekee
    const transactions = await Transaction.find({
        member: req.user._id,
        year: currentYear,
        type: { $in: ['share', 'social_fund'] }
    });

    const ledger = months.map((m, index) => {
        const record = transactions.find(t => t.month === (index + 1));
        return {
            month: m,
            status: record ? 'Paid' : (index <= currentMonthNum ? 'Not Paid' : 'Pending'),
            amount: record ? record.amount : 0
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