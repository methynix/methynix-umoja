const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupCode: { type: String },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

attendanceSchema.index({ meeting: 1, member: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
