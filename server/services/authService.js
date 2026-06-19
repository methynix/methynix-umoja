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

    let assignedRole = 'member';
    let targetGroupId;

    let group = await Group.findOne({ groupCode: userData.groupCode });

    if (!group) {
        group = await Group.create({
            name: userData.groupName, 
            groupCode: userData.groupCode
        });
        assignedRole = 'admin';
        targetGroupId = group._id;
    } else {
        targetGroupId = group._id;
    }

    const { confirmPassword, groupName, ...dataToSave } = userData;

    const newUser = await userRepository.create({
        ...dataToSave,
        role: assignedRole,
        groupId: targetGroupId
    });
    const token = signToken(newUser._id);
    
    return { token, user: newUser };
};

exports.login = async (phone, password) => {
    const user = await userRepository.findByPhone(phone);

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Namba ya simu au Password si sahihi', 401);
    }

    // During maintenance, only the superadmin (platform manager) may log in.
    const maintenance = await Settings.findOne({ key: 'maintenance' });
    if (maintenance?.value && user.role !== 'superadmin') {
        throw new AppError('Mfumo upo kwenye matengenezo. Tafadhali jaribu tena baadaye.', 503);
    }

    const token = signToken(user._id);

    return { token, user };
};