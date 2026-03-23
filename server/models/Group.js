const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    groupCode: { type: String, required: true, unique: true }, // For joining
    image: { type: String, default: null }, // URL to image
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);