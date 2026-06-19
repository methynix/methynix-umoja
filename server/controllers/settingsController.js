const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

exports.toggleMaintenance = asyncHandler(async (req, res) => {
    const settings = await Settings.findOneAndUpdate(
        { key: 'maintenance' },
        { value: req.body.value },
        { upsert: true, new: true }
    );

    res.status(200).json({
        status: 'success',
        data: { maintenance: settings.value }
    });
});

exports.getMaintenanceStatus = asyncHandler(async (req, res) => {
    const settings = await Settings.findOne({ key: 'maintenance' });
    res.status(200).json({
        status: 'success',
        data: { value: settings?.value || false }
    });
});