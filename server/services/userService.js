const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.registerMemberManually = async (adminUser, memberData) => {
    const existing = await userRepository.findByPhone(memberData.phone);
    if (existing) throw new AppError('Namba hii tayari imesajiliwa', 400);

    const newMember = await userRepository.create({
        ...memberData,
        groupCode: adminUser.groupCode, 
        role: 'member'
    });

    return newMember;
};

exports.getGroupMembers = async (requestingUser) => {
    return await userRepository.findAllScoped(requestingUser);
};

exports.removeMember = async (adminUser, memberId) => {
    const member = await userRepository.findById(memberId);

    if (!member) throw new AppError('Mwanachama hajapatikana', 404);

    if (adminUser.role !== 'superadmin' && member.groupId.toString() !== adminUser.groupId.toString()) {
        throw new AppError('Huna mamlaka ya kumfuta mwanachama wa kikundi kingine!', 403);
    }

    if (adminUser.role === 'secretary') {
        throw new AppError('Secretary hana mamlaka ya kufuta mwanachama. Tafadhali wasiliana na Admin.', 403);
    }

    return await User.findByIdAndDelete(memberId);
};

exports.registerMemberManually = async (creatorUser, memberData) => {
    const existing = await userRepository.findByPhone(memberData.phone);
    if (existing) throw new AppError('Namba hii tayari imesajiliwa', 400);

    let assignedRole = memberData.role || 'member';

    if (creatorUser.role === 'secretary') {
        assignedRole = 'member';
    }

    if (creatorUser.role === 'admin' && assignedRole === 'superadmin') {
        assignedRole = 'member';
    }

    const initialPassword = memberData.name.toLowerCase().replace(/\s/g, '');

    return await userRepository.create({
        ...memberData,
        password: initialPassword,
        role: assignedRole, 
        groupId: creatorUser.groupId,
        groupCode: creatorUser.groupCode
    });
};