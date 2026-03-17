const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupCode: { type: String, required: true },
    amountRequested: { type: Number, required: true },
    interestRate: { type: Number, default: 10 }, // 10% Interest
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'paid', 'overdue'], 
        default: 'pending' 
    },
    purpose: { type: String },
    dueDate: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);