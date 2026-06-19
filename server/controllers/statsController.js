const User = require('../models/User');
const Group = require('../models/Group');
const asyncHandler = require('../utils/asyncHandler');

exports.getGlobalStats = asyncHandler(async (req, res, next) => {
    const totalUsers = await User.countDocuments({ role: { $ne: 'superadmin' } });
    const uniqueGroups = await Group.countDocuments();
    
    const liquidityStats = await User.aggregate([
        { $match: { role: { $ne: 'superadmin' } } },
        {
            $group: {
                _id: null,
                totalShares: { $sum: "$shares" },
                totalSocial: { $sum: "$socialFund" }
            }
        }
    ]);

    const totalCash = (liquidityStats[0]?.totalShares || 0) + (liquidityStats[0]?.totalSocial || 0);

    res.status(200).json({
        status: 'success',
        data: {
            totalUsers,
            groupCount: uniqueGroups,
            totalCash
        }
    });
});