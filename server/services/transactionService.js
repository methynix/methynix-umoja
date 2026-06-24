const Transaction = require('../models/Transaction');
const userRepository = require('../repositories/userRepository');
const Group = require('../models/Group');
const AppError = require('../utils/AppError');

exports.getMemberHistory = async (memberId) => {
    return await Transaction.find({ member: memberId }).sort('-createdAt');
};

const getISOWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

exports.recordContribution = async (adminId, data) => {
    const { memberId, type } = data;

    const now = new Date();
    const targetMonth = now.getMonth() + 1;
    const targetYear = now.getFullYear();
    const targetWeek = getISOWeek(now);

    if (!memberId) throw new AppError('Mwanachama hajachaguliwa', 400);
    if (!['share', 'social_fund', 'mawazo'].includes(type)) {
        throw new AppError('Aina ya mchango si sahihi', 400);
    }

    const admin = await userRepository.findById(adminId);
    const group = await Group.findById(admin.groupId);
    if (!group) throw new AppError('Kikundi hakijapatikana', 404);

    let amount;
    let quantity = null;

    if (type === 'share') {
        const value = group.shareValue || 0;
        if (value <= 0) {
            throw new AppError('Thamani ya hisa haijawekwa. Mwenyekiti aiweke kwenye Mipangilio ya Kikundi.', 400);
        }
        const count = Number(data.shares);
        if (!count || count <= 0) throw new AppError('Ingiza idadi ya hisa', 400);
        quantity = count;
        amount = count * value;
    } else if (type === 'social_fund') {
        amount = group.socialFundAmount || 0;
        if (amount <= 0) throw new AppError('Kiasi cha Jamii hakijawekwa. Mwenyekiti akiweke kwenye Mipangilio ya Kikundi.', 400);
    } else {
        amount = group.mawazoAmount || 0;
        if (amount <= 0) throw new AppError('Kiasi cha Mawazo hakijawekwa. Mwenyekiti akiweke kwenye Mipangilio ya Kikundi.', 400);
    }

    const inc = {
        shares: type === 'share' ? amount : 0,
        socialFund: type === 'social_fund' ? amount : 0,
        mawazo: type === 'mawazo' ? amount : 0,
    };

    const updatedUser = await userRepository.updateStats(memberId, inc);
    if (!updatedUser) throw new AppError('Mwanachama hajapatikana', 404);

    return await Transaction.create({
        member: memberId,
        groupId: admin.groupId,
        groupCode: admin.groupCode,
        type,
        amount,
        quantity,
        week: targetWeek,
        month: targetMonth,
        year: targetYear,
        recordedBy: adminId
    });
};