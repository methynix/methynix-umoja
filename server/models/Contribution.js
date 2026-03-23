const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    month: { type: Number, required: true }, 
    year: { type: Number, required: true },
    shareAmount: { type: Number, default: 0 },
    socialAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'partial', 'not_paid'], default: 'paid' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

contributionSchema.index({ member: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Contribution', contributionSchema);