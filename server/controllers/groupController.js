const Group = require('../models/Group');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllGroups = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const groups = await Group.find().skip(skip).limit(limit).sort('name');
    const total = await Group.countDocuments();

    res.status(200).json({
        status: 'success',
        data: { groups, pages: Math.ceil(total / limit) }
    });
});

exports.getGroupMembers = asyncHandler(async (req, res) => {
    const members = await User.find({ groupId: req.params.id })
        .select('name phone role createdAt')
        .sort('name');

    res.status(200).json({
        status: 'success',
        data: { members }
    });
});