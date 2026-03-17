const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getGlobalStats = asyncHandler(async (req, res, next) => {
    // 1. Count Total Users
    const totalUsers = await User.countDocuments();

    // 2. Count Unique Groups
    const uniqueGroups = await User.distinct('groupCode');

    // 3. Calculate Total Liquidity (Sum of all shares + social funds in the platform)
    const liquidityStats = await User.aggregate([
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
            groupCount: uniqueGroups.length,
            totalCash
        }
    });
});