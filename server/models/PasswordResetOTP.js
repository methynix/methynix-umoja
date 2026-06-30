const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passwordResetOTPSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    attempts: { type: Number, default: 0 },
});

passwordResetOTPSchema.methods.isValid = async function (otp) {
    return bcrypt.compare(String(otp), this.otpHash);
};

module.exports = mongoose.model('PasswordResetOTP', passwordResetOTPSchema);
