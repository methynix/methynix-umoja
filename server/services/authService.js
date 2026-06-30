const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const Group = require('../models/Group');
const Settings = require('../models/Settings');
const PhoneOTP = require('../models/PhoneOTP');
const PasswordResetOTP = require('../models/PasswordResetOTP');
const MemberVerificationToken = require('../models/MemberVerificationToken');
const User = require('../models/User');
const { sendSMS } = require('./smsService');
const { sendEmail } = require('./emailService');
const sms = require('./smsTemplates');
const emailTemplates = require('./emailTemplates');

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

// ─── Password reset (via email — keeps SMS costs down) ───────────────────────

const GENERIC_RESET_RESULT = { message: 'Kama taarifa ulizoweka ni sahihi, tumetuma OTP kwenye email yako.' };

exports.requestPasswordReset = async (phone, email) => {
    if (!phone || String(phone).trim().length !== 10) {
        throw new AppError('Tafadhali weka namba ya simu sahihi (tarakimu 10).', 400);
    }
    if (!email || !String(email).trim()) {
        throw new AppError('Tafadhali weka email yako.', 400);
    }
    const normalizedPhone = String(phone).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await userRepository.findByPhone(normalizedPhone);
    if (!user) return GENERIC_RESET_RESULT; // don't leak whether this phone is registered

    if (user.email) {
        // Email already on file — it must match. Never send to an attacker-supplied address.
        if (user.email !== normalizedEmail) return GENERIC_RESET_RESULT;
    } else {
        // First time this account sets an email (email is optional at registration).
        const emailTaken = await User.findOne({ email: normalizedEmail });
        if (emailTaken) return GENERIC_RESET_RESULT;
        user.email = normalizedEmail;
        await user.save({ validateBeforeSave: false });
    }

    const existing = await PasswordResetOTP.findOne({ phone: normalizedPhone });
    if (existing && existing.attempts >= 3) {
        throw new AppError('Umevuka kikomo cha OTP. Jaribu tena baada ya dakika 10.', 429);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await PasswordResetOTP.findOneAndUpdate(
        { phone: normalizedPhone },
        { otpHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 },
        { upsert: true, returnDocument: 'after' }
    );

    const { subject, html } = emailTemplates.passwordResetOTP({ name: user.name, code: otp });
    await sendEmail(user.email, subject, html);

    return GENERIC_RESET_RESULT;
};

exports.verifyPasswordResetOTP = async (phone, otp) => {
    const normalizedPhone = String(phone || '').trim();
    const record = await PasswordResetOTP.findOne({ phone: normalizedPhone });
    if (!record) throw new AppError('Tafadhali omba OTP kwanza.', 400);
    if (record.expiresAt < new Date()) throw new AppError('OTP imekwisha muda. Tafadhali omba tena.', 400);
    if (record.attempts >= 5) throw new AppError('Majaribio mengi ya OTP. Omba OTP mpya.', 429);

    const valid = await record.isValid(otp);
    if (!valid) {
        await PasswordResetOTP.findByIdAndUpdate(record._id, { $inc: { attempts: 1 } });
        throw new AppError('OTP si sahihi. Jaribu tena.', 400);
    }

    await PasswordResetOTP.findByIdAndDelete(record._id);

    const user = await userRepository.findByPhone(normalizedPhone);
    if (!user) throw new AppError('Mtumiaji hajapatikana', 404);

    const resetToken = jwt.sign(
        { id: user._id, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
    );
    return { resetToken };
};

exports.confirmPasswordReset = async (resetToken, newPassword, confirmPassword) => {
    if (!newPassword || newPassword.length < 6) {
        throw new AppError('Password lazima iwe na herufi 6 au zaidi.', 400);
    }
    if (newPassword !== confirmPassword) {
        throw new AppError('Password hazifanani.', 400);
    }

    let decoded;
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
        throw new AppError('Muda wa kuweka password mpya umeisha. Anza upya mchakato.', 401);
    }
    if (decoded.purpose !== 'password_reset') {
        throw new AppError('Token batili.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('Mtumiaji hajapatikana', 404);

    user.password = newPassword;
    await user.save();

    return { message: 'Password imebadilishwa. Sasa unaweza kuingia.' };
};

// ─── Manually-added member verification (SMS link → set password) ───────────

exports.getMemberVerificationInfo = async (token) => {
    const record = await MemberVerificationToken.findOne({ token });
    if (!record) throw new AppError('Link si sahihi au imekwisha muda.', 400);
    if (record.expiresAt < new Date()) throw new AppError('Link imekwisha muda. Wasiliana na kiongozi wa kikundi chako.', 400);

    const user = await User.findById(record.userId);
    if (!user) throw new AppError('Mwanachama hajapatikana', 404);
    if (user.status === 'active') throw new AppError('Akaunti hii tayari imethibitishwa. Tafadhali ingia (login).', 400);

    return { name: user.name, phone: user.phone };
};

exports.approveMember = async (token, newPassword, confirmPassword) => {
    if (!newPassword || newPassword.length < 6) {
        throw new AppError('Password lazima iwe na herufi 6 au zaidi.', 400);
    }
    if (newPassword !== confirmPassword) {
        throw new AppError('Password hazifanani.', 400);
    }

    const record = await MemberVerificationToken.findOne({ token });
    if (!record) throw new AppError('Link si sahihi au imekwisha muda.', 400);
    if (record.expiresAt < new Date()) throw new AppError('Link imekwisha muda. Wasiliana na kiongozi wa kikundi chako.', 400);

    const user = await User.findById(record.userId);
    if (!user) throw new AppError('Mwanachama hajapatikana', 404);

    user.password = newPassword;
    user.status = 'active';
    await user.save();

    await MemberVerificationToken.findByIdAndDelete(record._id);

    const newToken = signToken(user._id);
    return { token: newToken, user: safeUser(user) };
};
