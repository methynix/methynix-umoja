const Settings = require('../models/Settings');

module.exports = async (req, res, next) => {
    const maintenance = await Settings.findOne({ key: 'maintenance' });
    
    if (maintenance?.value) {
        if (req.user && req.user.role === 'superadmin') {
            return next();
        }
        return res.status(503).json({
            status: 'maintenance',
            message: 'Mfumo upo kwenye matengenezo'
        });
    }
    next();
};