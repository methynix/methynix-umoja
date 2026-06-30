const mongoose = require('mongoose');

const memberVerificationTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

module.exports = mongoose.model('MemberVerificationToken', memberVerificationTokenSchema);
