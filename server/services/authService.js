const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const Group=require("../models/Group");
const Settings = require('../models/Settings');
const asyncHandler=require("../utils/asyncHandler");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.register = async (userData) => {
    const existingUser = await userRepository.findByPhone(userData.phone);
    if (existingUser) throw new AppError('Namba hii tayari imesajiliwa', 400);

    if (!userData.groupCode || !userData.groupCode.trim()) {
        throw new AppError('Tafadhali weka Code ya kikundi', 400);
    }
    if (!userData.groupName || !userData.groupName.trim()) {
        throw new AppError('Tafadhali weka Jina la kikundi', 400);
    }

    const code = userData.groupCode.trim();

    const existingGroup = await Group.findOne({ groupCode: code });
    if (existingGroup) {
        throw new AppError('Code hii ya kikundi tayari imetumika. Tafadhali chagua nyingine.', 400);
    }

    const group = await Group.create({
        name: userData.groupName.trim(),
        groupCode: code,
        type: userData.type === 'chama' ? 'chama' : 'vicoba',
        shareValue: Number(userData.shareValue) || 0,
    });

    const { confirmPassword, groupName, ...dataToSave } = userData;

    const newUser = await userRepository.create({
        ...dataToSave,
        groupCode: code,
        role: 'admin',
        groupId: group._id,
    });

    group.creator = newUser._id;
    await group.save();

    const token = signToken(newUser._id);

    return { token, user: newUser };
};

exports.login = async (phone, password, groupCode) => {
    const user = await userRepository.findByPhone(phone);

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Namba ya simu au Password si sahihi', 401);
    }

    if (groupCode && groupCode.trim() && user.role !== 'superadmin') {
        if (user.groupCode !== groupCode.trim()) {
            throw new AppError('Code ya kikundi si sahihi', 401);
        }
    }

    // During maintenance, only the superadmin (platform manager) may log in.
    const maintenance = await Settings.findOne({ key: 'maintenance' });
    if (maintenance?.value && user.role !== 'superadmin') {
        throw new AppError('Mfumo upo kwenye matengenezo. Tafadhali jaribu tena baadaye.', 503);
    }

    const token = signToken(user._id);

    return { token, user };
};