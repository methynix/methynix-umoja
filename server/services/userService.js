const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const MemberVerificationToken = require('../models/MemberVerificationToken');
const { sendSMS } = require('./smsService');
const sms = require('./smsTemplates');

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
        // Admin can create member/secretary/treasurer — NEVER another admin or superadmin.
        assignedRole = ['member', 'secretary', 'treasurer'].includes(requested)
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

    // Phone is unique per group: block only if this number is already in THIS
    // group. The same person may still be added to other groups.
    const phoneQuery = assignedRole === 'superadmin'
        ? { phone: memberData.phone, role: 'superadmin' }
        : { phone: memberData.phone, groupCode };
    const existing = await User.findOne(phoneQuery);
    if (existing) throw new AppError('Namba hii tayari imesajiliwa kwenye kikundi hiki', 400);

    // Superadmin-to-superadmin is an internal, trusted bootstrap action — stays
    // immediately active with a chosen/default password, same as before.
    if (assignedRole === 'superadmin') {
        const initialPassword =
            memberData.password || memberData.name.toLowerCase().replace(/\s/g, '');

        return await userRepository.create({
            name: memberData.name,
            phone: memberData.phone,
            password: initialPassword,
            role: assignedRole,
            shares: 0,
            socialFund: 0,
            groupId,
            groupCode,
        });
    }

    // Ordinary members: identity isn't proven yet (whoever filled the form could
    // have mistyped the phone, or it could belong to someone else entirely).
    // Account starts 'pending' with a password nobody knows; the member must
    // click the SMS link to confirm it's really their number and set their own password.
    const placeholderPassword = crypto.randomBytes(24).toString('hex');

    const newUser = await userRepository.create({
        name: memberData.name,
        phone: memberData.phone,
        email: memberData.email ? String(memberData.email).trim().toLowerCase() : undefined,
        password: placeholderPassword,
        role: assignedRole,
        status: 'pending',
        shares: Number(memberData.shares) || 0,
        socialFund: Number(memberData.socialFund) || 0,
        groupId,
        groupCode,
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await MemberVerificationToken.create({
        userId: newUser._id,
        token: verifyToken,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    });

    const link = `${process.env.CLIENT_URL}/verify-member/${verifyToken}`;
    sendSMS(newUser.phone, sms.memberVerification({ name: newUser.name, link }));

    return newUser;
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
