const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    groupCode: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    type: { type: String, enum: ['regular', 'contribution'], default: 'regular' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
