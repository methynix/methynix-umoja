const meetingService = require('../services/meetingService');
const asyncHandler = require('../utils/asyncHandler');

exports.createMeeting = asyncHandler(async (req, res) => {
    const meeting = await meetingService.createMeeting(req.user, req.body);
    res.status(201).json({ status: 'success', data: { meeting } });
});

exports.getGroupMeetings = asyncHandler(async (req, res) => {
    const meetings = await meetingService.getGroupMeetings(req.user.groupCode);
    res.status(200).json({ status: 'success', data: { meetings } });
});

exports.getMeetingDetail = asyncHandler(async (req, res) => {
    const { meeting, attendance, members } = await meetingService.getMeetingDetail(req.params.id, req.user);
    res.status(200).json({ status: 'success', data: { meeting, attendance, members } });
});

exports.saveAttendance = asyncHandler(async (req, res) => {
    const attendance = await meetingService.saveAttendance(req.params.id, req.user, req.body.records);
    res.status(200).json({ status: 'success', data: { attendance } });
});

exports.payFine = asyncHandler(async (req, res) => {
    const record = await meetingService.payFine(req.params.attendanceId, req.user);
    res.status(200).json({ status: 'success', data: { record } });
});

exports.closeMeeting = asyncHandler(async (req, res) => {
    const meeting = await meetingService.closeMeeting(req.params.id, req.user);
    res.status(200).json({ status: 'success', data: { meeting } });
});

exports.getMyFines = asyncHandler(async (req, res) => {
    const fines = await meetingService.getMyFines(req.user._id, req.user.groupCode);
    res.status(200).json({ status: 'success', data: { fines } });
});
