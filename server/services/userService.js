const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.registerMemberManually = async (adminUser, memberData) => {
    const existing = await userRepository.findByPhone(memberData.phone);
    if (existing) throw new AppError('Namba hii tayari imesajiliwa', 400);

    // Enforce group scoping
    const newMember = await userRepository.create({
        ...memberData,
        groupCode: adminUser.groupCode, // Forced to match the creator's group
        role: 'member'
    });

    return newMember;
};

exports.getGroupMembers = async (requestingUser) => {
    return await userRepository.findAllScoped(requestingUser);
};