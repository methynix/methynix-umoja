const Group = require('../models/Group');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getSummary = asyncHandler(async (req, res, next) => {
    const groupCode = req.user.groupCode;

    const members = await User.find({ groupCode }).select('shares socialFund mawazo');
    const totalShares = members.reduce((a, m) => a + (m.shares || 0), 0);
    const totalSocialFund = members.reduce((a, m) => a + (m.socialFund || 0), 0);
    const totalMawazo = members.reduce((a, m) => a + (m.mawazo || 0), 0);

    const loans = await Loan.find({
        groupCode,
        status: { $in: ['approved', 'paid'] }
    }).select('member amountRequested interestRate');

    const totalLoaned = loans.reduce((a, l) => a + (l.amountRequested || 0), 0);
    const loanInterest = loans.reduce(
        (a, l) => a + (l.amountRequested || 0) * (l.interestRate || 0) / 100,
        0
    );
    const borrowers = new Set(loans.map((l) => String(l.member))).size;

    const fineAgg = await Transaction.aggregate([
        { $match: { groupCode, type: 'fine', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const fineRevenue = fineAgg[0]?.total || 0;
    const interestProfit = Math.round(loanInterest) + fineRevenue;

    const myShares = req.user.shares || 0;
    const myDividend = totalShares > 0 ? Math.round((myShares / totalShares) * interestProfit) : 0;

    res.status(200).json({
        status: 'success',
        data: {
            summary: {
                totalShares,
                totalSocialFund,
                totalMawazo,
                totalLoaned,
                interestProfit,
                borrowers,
                membersCount: members.length,
                myShares,
                myDividend
            }
        }
    });
});

exports.getAllGroups = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const groups = await Group.find().skip(skip).limit(limit).sort('name');
    const total = await Group.countDocuments();

    res.status(200).json({
        status: 'success',
        data: { groups, pages: Math.ceil(total / limit) }
    });
});

exports.getGroupMembers = asyncHandler(async (req, res) => {
    const members = await User.find({ groupId: req.params.id })
        .select('name phone role createdAt')
        .sort('name');

    res.status(200).json({
        status: 'success',
        data: { members }
    });
});
exports.updateMyGroup = asyncHandler(async (req, res, next) => {
    const { name, groupCode, shareValue, socialFundAmount, mawazoAmount, loanThreshold, lateFineAmount, absentFineAmount } = req.body;

    const group = await Group.findById(req.user.groupId);
    if (!group) return next(new AppError('Kikundi hakijapatikana', 404));

    if (groupCode && groupCode.trim() !== group.groupCode) {
        const taken = await Group.findOne({ groupCode: groupCode.trim() });
        if (taken) return next(new AppError('Code hii tayari imetumika na kikundi kingine.', 400));
        group.groupCode = groupCode.trim();
        await User.updateMany({ groupId: group._id }, { groupCode: groupCode.trim() });
    }

    if (name && name.trim()) group.name = name.trim();
    if (shareValue !== undefined && shareValue !== '') group.shareValue = Number(shareValue);
    if (socialFundAmount !== undefined && socialFundAmount !== '') group.socialFundAmount = Number(socialFundAmount);
    if (mawazoAmount !== undefined && mawazoAmount !== '') group.mawazoAmount = Number(mawazoAmount);
    if (loanThreshold !== undefined && loanThreshold !== '') group.loanThreshold = Number(loanThreshold);
    if (lateFineAmount !== undefined && lateFineAmount !== '') group.lateFineAmount = Number(lateFineAmount);
    if (absentFineAmount !== undefined && absentFineAmount !== '') group.absentFineAmount = Number(absentFineAmount);

    await group.save();

    res.status(200).json({
        status: 'success',
        message: 'Mipangilio ya kikundi imehifadhiwa',
        data: { group }
    });
});
