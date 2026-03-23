const Group = require('../models/Group');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllGroups = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const groups = await Group.find().skip(skip).limit(limit).sort('-createdAt');
    const total = await Group.countDocuments();

    res.status(200).json({
        status: 'success',
        data: { groups, pages: Math.ceil(total / limit) }
    });
});