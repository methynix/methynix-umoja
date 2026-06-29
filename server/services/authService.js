const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const Group = require('../models/Group');
const Settings = require('../models/Settings');
const PhoneOTP = require('../models/PhoneOTP');
const { sendSMS } = require('./smsService');
const sms = require('./smsTemplates');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const safeUser = (userDoc) => {
    const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete obj.password;
    return obj;
};

exports.requestOTP = async (phone) => {
    if (!phone || String(phone).trim().length !== 10) {
        throw new AppError('Tafadhali weka namba ya simu sahihi (tarakimu 10).', 400);
    }
    const normalizedPhone = String(phone).trim();

    // Prevent spam: max 3 pending OTPs per phone at a time
    const existing = await PhoneOTP.findOne({ phone: normalizedPhone });
    if (existing && existing.attempts >= 3) {
        throw new AppError('Umevuka kikomo cha OTP. Jaribu tena baada ya dakika 10.', 429);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await PhoneOTP.findOneAndUpdate(
        { phone: normalizedPhone },
        { otpHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 },
        { upsert: true, new: true }
    );

    await sendSMS(normalizedPhone, sms.otp({ code: otp }));

    return { message: 'OTP imetumwa kwa namba yako ya simu.' };
};

exports.register = async (userData) => {
    const { otp, ...rest } = userData;
    const phone = String(rest.phone || '').trim();

    // Verify OTP before doing anything else
    const otpRecord = await PhoneOTP.findOne({ phone });
    if (!otpRecord) throw new AppError('Tafadhali omba OTP kwanza na uithibitishe.', 400);
    if (otpRecord.expiresAt < new Date()) throw new AppError('OTP imekwisha muda. Tafadhali omba tena.', 400);
    if (otpRecord.attempts >= 5) throw new AppError('Majaribio mengi ya OTP. Omba OTP mpya.', 429);

    const otpValid = await otpRecord.isValid(otp);
    if (!otpValid) {
        await PhoneOTP.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
        throw new AppError('OTP si sahihi. Jaribu tena.', 400);
    }

    // OTP is valid — delete it immediately
    await PhoneOTP.findByIdAndDelete(otpRecord._id);

    const existingUser = await userRepository.findByPhone(phone);
    if (existingUser) throw new AppError('Namba hii tayari imesajiliwa', 400);

    if (!rest.groupCode || !rest.groupCode.trim()) {
        throw new AppError('Tafadhali weka Code ya kikundi', 400);
    }
    if (!rest.groupName || !rest.groupName.trim()) {
        throw new AppError('Tafadhali weka Jina la kikundi', 400);
    }

    const code = rest.groupCode.trim();
    const existingGroup = await Group.findOne({ groupCode: code });
    if (existingGroup) {
        throw new AppError('Code hii ya kikundi tayari imetumika. Tafadhali chagua nyingine.', 400);
    }

    const group = await Group.create({
        name: rest.groupName.trim(),
        groupCode: code,
        type: rest.type === 'chama' ? 'chama' : 'vicoba',
        shareValue: Number(rest.shareValue) || 0,
    });

    const { confirmPassword, groupName, ...dataToSave } = rest;

    const newUser = await userRepository.create({
        ...dataToSave,
        groupCode: code,
        role: 'admin',
        groupId: group._id,
    });

    group.creator = newUser._id;
    await group.save();

    const token = signToken(newUser._id);
    return { token, user: safeUser(newUser) };
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

    const maintenance = await Settings.findOne({ key: 'maintenance' });
    if (maintenance?.value && user.role !== 'superadmin') {
        throw new AppError('Mfumo upo kwenye matengenezo. Tafadhali jaribu tena baadaye.', 503);
    }

    const token = signToken(user._id);
    return { token, user: safeUser(user) };
};
