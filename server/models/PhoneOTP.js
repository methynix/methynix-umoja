const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const phoneOTPSchema = new mongoose.Schema({
    phone: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    attempts: { type: Number, default: 0 },
});

phoneOTPSchema.methods.isValid = async function (otp) {
    return bcrypt.compare(String(otp), this.otpHash);
};

module.exports = mongoose.model('PhoneOTP', phoneOTPSchema);
