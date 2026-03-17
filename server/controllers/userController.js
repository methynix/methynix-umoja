const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllMembers = asyncHandler(async (req, res, next) => {
    const members = await userService.getGroupMembers(req.user);
    res.status(200).json({
        status: 'success',
        results: members.length,
        data: { members }
    });
});

exports.createMember = asyncHandler(async (req, res, next) => {
    const member = await userService.registerMemberManually(req.user, req.body);
    res.status(201).json({
        status: 'success',
        data: { member }
    });
});