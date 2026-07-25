const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Jina linahitajika'] },
    // Phone/email are unique PER GROUP (see compound indexes below), not globally —
    // one person may belong to several different groups with the same phone number.
    phone: { type: String, required: [true, 'Namba ya simu inahitajika'] },
    email: { type: String, lowercase: true, trim: true, default: undefined },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['superadmin','admin', 'secretary', 'treasurer', 'member'], default: 'member' },
    status: { type: String, enum: ['pending', 'active'], default: 'active' },
     groupId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group' 
    },
    groupCode: String,
    shares: { type: Number, default: 0 },
    socialFund: { type: Number, default: 0 },
    mawazo: { type: Number, default: 0 },
    activeLoan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }
}, { timestamps: true });

// A phone/email is unique only WITHIN a group, so the same person can join
// multiple different groups. groupCode is 'SYSTEM_GLOBAL' for superadmins.
userSchema.index({ groupCode: 1, phone: 1 }, { unique: true });
userSchema.index(
    { groupCode: 1, email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);;
});

userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
module.exports = mongoose.model('User', userSchema);