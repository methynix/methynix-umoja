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
    const WEEKS = 12;

    const startOfWeek = (d) => {
        const x = new Date(d);
        const day = x.getDay() || 7;
        x.setHours(0, 0, 0, 0);
        x.setDate(x.getDate() - (day - 1));
        return x;
    };

    const getWeekOfYear = (d) => {
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.floor((d - yearStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
    };

    const now = new Date();
    const curStart = startOfWeek(now);
    const spanStart = new Date(curStart);
    spanStart.setDate(spanStart.getDate() - (WEEKS - 1) * 7);

    const transactions = await Transaction.find({
        member: req.user._id,
        type: { $in: ['share', 'social_fund', 'mawazo'] },
        createdAt: { $gte: spanStart }
    });

    const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

    const ledger = [];
    for (let i = 0; i < WEEKS; i++) {
        const wStart = new Date(curStart);
        wStart.setDate(wStart.getDate() - i * 7);
        const wEnd = new Date(wStart);
        wEnd.setDate(wEnd.getDate() + 7);

        const inWin = transactions.filter((t) => t.createdAt >= wStart && t.createdAt < wEnd);
        const sum = (type) => inWin.filter((t) => t.type === type).reduce((a, t) => a + t.amount, 0);

        const shareAmount = sum('share');
        const socialAmount = sum('social_fund');
        const mawazoAmount = sum('mawazo');

        const isCurrent = i === 0;
        const complete = shareAmount > 0 && socialAmount > 0 && mawazoAmount > 0;

        ledger.push({
            label: `${fmt(wStart)} - ${fmt(new Date(wEnd.getTime() - 1))}`,
            weekNumber: getWeekOfYear(wStart),
            shareAmount,
            socialAmount,
            mawazoAmount,
            status: complete ? 'Paid' : isCurrent ? 'Pending' : 'Not Paid'
        });
    }

    res.status(200).json({ status: 'success', data: { ledger } });
});
exports.recordContribution = asyncHandler(async (req, res, next) => {
    const transaction = await transactionService.recordContribution(req.user._id, req.body);
    
    res.status(201).json({
        status: 'success',
        data: { transaction }
    });
});