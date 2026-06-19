const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    groupCode: { type: String },
    type: {
        type: String,
        enum: ['share', 'social_fund', 'loan_disbursement', 'loan_repayment', 'fine'],
        required: true
    },
    amount: { type: Number, required: true },
    // Used by the yearly ledger view.
    month: { type: Number, min: 1, max: 12 },
    year: { type: Number },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Secretary au Admin
}, { timestamps: true });

// Speed up history & ledger lookups.
transactionSchema.index({ member: 1, createdAt: -1 });
transactionSchema.index({ member: 1, year: 1, month: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
