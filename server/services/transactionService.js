const transactionRepository = require('../repositories/transactionRepository');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.recordContribution = async (adminId, data) => {
    const { memberId, type, amount } = data;
    const admin = await userRepository.findById(adminId);
    
    // 1. Update User Stats (Atomic Update)
    let shareInc = 0;
    let socialInc = 0;

    if (type === 'share') shareInc = amount;
    if (type === 'social_fund') socialInc = amount;

    const updatedUser = await userRepository.updateStats(memberId, shareInc, socialInc);
    if (!updatedUser) throw new AppError('Mwanachama hajapatikana', 404);

    // 2. Record the Ledger Transaction
    return await Transaction.create({
        member: memberId,
        groupId: admin.groupId,
        groupCode: admin.groupCode,
        type,
        amount,
        recordedBy: adminId,
        month: new Date().getMonth() + 1, // Mwezi wa sasa
        year: new Date().getFullYear()
    });
};

exports.getMemberHistory = async (memberId) => {
    return await transactionRepository.findByMember(memberId);
};