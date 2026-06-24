const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupCode: { type: String, required: true },
    amountRequested: { type: Number, required: true },
    interestRate: { type: Number, default: 10 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'paid', 'overdue'],
        default: 'pending'
    },
    purpose: { type: String },

    guarantorInternalName: { type: String },
    guarantorInternalPhone: { type: String },
    guarantorExternalName: { type: String },
    guarantorExternalPhone: { type: String },

    collateralType: { type: String, enum: ['shares', 'other'], default: 'shares' },
    collateralDescription: { type: String },

    applicantSignature: { type: String },
    treasurerSignature: { type: String },
    secretarySignature: { type: String },

    dueDate: { type: Date },
    totalPaid: { type: Number, default: 0 },
    repaidAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
