const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * Register a user manually. The role that gets assigned depends ENTIRELY
 * on who is doing the registering:
 *
 *  - superadmin  -> may ONLY create fellow superadmins (co-managers for help).
 *                   They are global (no group) and are NEVER ordinary members.
 *  - admin       -> may create member / secretary / admin inside THEIR group.
 *  - secretary   -> may create members only, inside their group.
 */
exports.registerMemberManually = async (creatorUser, memberData) => {
    const existing = await userRepository.findByPhone(memberData.phone);
    if (existing) throw new AppError('Namba hii tayari imesajiliwa', 400);

    let assignedRole;
    let groupId;
    let groupCode;

    if (creatorUser.role === 'superadmin') {
        // Superadmin is a manager: cannot register ordinary users,
        // can only create another superadmin.
        assignedRole = 'superadmin';
        groupId = undefined;            // global, not tied to any group
        groupCode = 'SYSTEM_GLOBAL';
    } else if (creatorUser.role === 'admin') {
        const requested = memberData.role || 'member';
        // Admin can create member/secretary/admin, but NEVER a superadmin.
        assignedRole = ['member', 'secretary', 'admin'].includes(requested)
            ? requested
            : 'member';
        groupId = creatorUser.groupId;
        groupCode = creatorUser.groupCode;
    } else if (creatorUser.role === 'secretary') {
        assignedRole = 'member';
        groupId = creatorUser.groupId;
        groupCode = creatorUser.groupCode;
    } else {
        throw new AppError('Huna ruhusa ya kusajili watumiaji.', 403);
    }

    // Default first password = name without spaces, lowercase (unless one is supplied).
    const initialPassword =
        memberData.password || memberData.name.toLowerCase().replace(/\s/g, '');

    return await userRepository.create({
        name: memberData.name,
        phone: memberData.phone,
        password: initialPassword,
        role: assignedRole,
        shares: assignedRole === 'superadmin' ? 0 : Number(memberData.shares) || 0,
        socialFund: assignedRole === 'superadmin' ? 0 : Number(memberData.socialFund) || 0,
        groupId,
        groupCode,
    });
};

exports.getGroupMembers = async (requestingUser) => {
    return await userRepository.findAllScoped(requestingUser);
};

exports.removeMember = async (adminUser, memberId) => {
    if (adminUser._id.toString() === memberId.toString()) {
        throw new AppError('Huwezi kujifuta mwenyewe kwenye mfumo!', 400);
    }

    const member = await User.findById(memberId);
    if (!member) throw new AppError('Mwanachama hajapatikana', 404);

    // Only an admin within the same group may remove a member.
    if (
        adminUser.role !== 'superadmin' &&
        member.groupId?.toString() !== adminUser.groupId?.toString()
    ) {
        throw new AppError('Huna mamlaka ya kumfuta mwanachama wa kikundi kingine!', 403);
    }

    return await User.findByIdAndDelete(memberId);
};
