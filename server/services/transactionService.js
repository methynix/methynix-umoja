const Transaction = require('../models/Transaction');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.getMemberHistory = async (memberId) => {
    return await Transaction.find({ member: memberId }).sort('-createdAt');
};

exports.recordContribution = async (adminId, data) => {
    const { memberId, type, amount, month, year } = data;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const targetMonth = Number(month) || currentMonth;
    const targetYear = Number(year) || currentYear;

    if (!memberId) throw new AppError('Mwanachama hajachaguliwa', 400);
    if (!['share', 'social_fund'].includes(type)) {
        throw new AppError('Aina ya mchango si sahihi', 400);
    }
    if (!amount || Number(amount) <= 0) {
        throw new AppError('Tafadhali ingiza kiasi halali', 400);
    }

    if (targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth)) {
        throw new AppError('Huwezi kurekodi mchango wa mwezi wa mbeleni!', 400);
    }

    const admin = await userRepository.findById(adminId);

    const shareInc = type === 'share' ? Number(amount) : 0;
    const socialInc = type === 'social_fund' ? Number(amount) : 0;

    const updatedUser = await userRepository.updateStats(memberId, shareInc, socialInc);
    if (!updatedUser) throw new AppError('Mwanachama hajapatikana', 404);

    return await Transaction.create({
        member: memberId,
        groupId: admin.groupId,
        groupCode: admin.groupCode,
        type,
        amount: Number(amount),
        month: targetMonth,
        year: targetYear,
        recordedBy: adminId
    });
};