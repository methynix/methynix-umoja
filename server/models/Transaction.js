const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupCode: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['share', 'social_fund', 'loan_disbursement', 'loan_repayment', 'fine'], 
        required: true 
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Secretary au Admin
}, { timestamps: true });

// Indexing kwa ajili ya speed ya kuvuta historia
transactionSchema.index({ member: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);