const express = require('express');
const router = express.Router();
const mc = require('../controllers/meetingController');
const { restrictTo } = require('../middlewares/authMiddleware');

const leaders = restrictTo('admin', 'secretary', 'treasurer');

router.get('/my-fines', mc.getMyFines);
router.get('/', mc.getGroupMeetings);
router.post('/', leaders, mc.createMeeting);
router.get('/:id', mc.getMeetingDetail);
router.post('/:id/attendance', leaders, mc.saveAttendance);
router.patch('/:id/fines/:attendanceId/pay', leaders, mc.payFine);
router.patch('/:id/close', leaders, mc.closeMeeting);

module.exports = router;
