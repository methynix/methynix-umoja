const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    groupCode: { type: String, required: true, unique: true },
    type: { type: String, enum: ['vicoba', 'chama'], default: 'vicoba' },
    shareValue: { type: Number, default: 0 },
    socialFundAmount: { type: Number, default: 0 },
    mawazoAmount: { type: Number, default: 0 },
    loanThreshold: { type: Number, default: 0 },
    image: { type: String, default: null }, // URL to image
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);