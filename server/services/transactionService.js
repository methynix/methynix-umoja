const transactionRepository = require('../repositories/transactionRepository');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.recordContribution = async (adminId, data) => {
    const { memberId, type, amount } = data;
    const admin = await userRepository.findById(adminId);
    const member = await userRepository.findById(memberId);

    if (!member) throw new AppError('Mwanachama hajapatikana', 404);

    // Update User Balance atomically
    if (type === 'share') {
        await userRepository.updateStats(memberId, amount, 0);
    } else if (type === 'social_fund') {
        await userRepository.updateStats(memberId, 0, amount);
    }

    // Record the transaction
    return await transactionRepository.create({
        member: memberId,
        groupCode: admin.groupCode,
        type,
        amount,
        recordedBy: adminId
    });
};

exports.getMemberHistory = async (memberId) => {
    return await transactionRepository.findByMember(memberId);
};