const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Jina linahitajika'] },
    phone: { type: String, required: [true, 'Namba ya simu inahitajika'], unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['superadmin','admin', 'secretary', 'member'], default: 'member' },
    groupCode: { type: String, default: null }, 
    shares: { type: Number, default: 0 },
    socialFund: { type: Number, default: 0 },
    activeLoan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }
}, { timestamps: true });

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