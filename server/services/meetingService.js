const Meeting = require('../models/Meeting');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/AppError');

exports.createMeeting = async (actor, payload) => {
    const { title, date, type } = payload;
    if (!title || !title.trim()) throw new AppError('Kichwa cha mkutano kinahitajika', 400);

    return await Meeting.create({
        groupCode: actor.groupCode,
        groupId: actor.groupId,
        title: title.trim(),
        date: date || new Date(),
        type: type || 'regular',
        createdBy: actor._id
    });
};

exports.getGroupMeetings = async (groupCode) => {
    return await Meeting.find({ groupCode }).sort({ date: -1 }).limit(50);
};

exports.getMeetingDetail = async (meetingId, actor) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new AppError('Mkutano haujapatikana', 404);
    if (meeting.groupCode !== actor.groupCode) throw new AppError('Huna ruhusa ya mkutano huu', 403);

    const attendance = await Attendance.find({ meeting: meetingId })
        .populate('member', 'name phone role')
        .populate('recordedBy', 'name')
        .sort('createdAt');

    const members = await User.find({
        groupCode: actor.groupCode,
        role: { $ne: 'superadmin' }
    }).select('name phone role').sort('name');

    return { meeting, attendance, members };
};

exports.saveAttendance = async (meetingId, actor, records) => {
    if (!Array.isArray(records) || records.length === 0) {
        throw new AppError('Orodha ya mahudhurio haikupatikana', 400);
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new AppError('Mkutano haujapatikana', 404);
    if (meeting.groupCode !== actor.groupCode) throw new AppError('Huna ruhusa', 403);
    if (meeting.status === 'closed') throw new AppError('Mkutano huu umefungwa', 400);

    const group = await Group.findById(meeting.groupId);
    const lateFine = group?.lateFineAmount || 0;
    const absentFine = group?.absentFineAmount || 0;

    const existing = await Attendance.find({ meeting: meetingId });
    const existingMap = {};
    existing.forEach(r => { existingMap[String(r.member)] = r; });

    const ops = records.map(({ memberId, status }) => {
        const fineAmount = status === 'absent' ? absentFine : status === 'late' ? lateFine : 0;
        const prev = existingMap[String(memberId)];
        const keepPaid = prev?.finePaid && prev.status === status;

        return {
            updateOne: {
                filter: { meeting: meetingId, member: memberId },
                update: {
                    $set: {
                        meeting: meetingId,
                        member: memberId,
                        groupCode: actor.groupCode,
                        status,
                        fineAmount,
                        finePaid: keepPaid ? true : false,
                        paidAt: keepPaid ? prev.paidAt : null,
                        recordedBy: actor._id
                    }
                },
                upsert: true
            }
        };
    });

    await Attendance.bulkWrite(ops);
    return await Attendance.find({ meeting: meetingId })
        .populate('member', 'name phone role')
        .sort('createdAt');
};

exports.payFine = async (attendanceId, actor) => {
    const record = await Attendance.findById(attendanceId).populate('member', 'name phone');
    if (!record) throw new AppError('Rekodi ya faini haijapatikana', 404);
    if (record.groupCode !== actor.groupCode) throw new AppError('Huna ruhusa', 403);
    if (record.finePaid) throw new AppError('Faini hii tayari imelipwa', 400);
    if (record.fineAmount <= 0) throw new AppError('Hakuna faini ya kulipa', 400);

    record.finePaid = true;
    record.paidAt = new Date();
    await record.save();

    await Transaction.create({
        member: record.member._id,
        groupCode: record.groupCode,
        type: 'fine',
        amount: record.fineAmount,
        status: 'completed',
        recordedBy: actor._id
    });

    return record;
};

exports.closeMeeting = async (meetingId, actor) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new AppError('Mkutano haujapatikana', 404);
    if (meeting.groupCode !== actor.groupCode) throw new AppError('Huna ruhusa', 403);
    if (meeting.status === 'closed') throw new AppError('Mkutano huu tayari umefungwa', 400);

    meeting.status = 'closed';
    await meeting.save();
    return meeting;
};

exports.getMyFines = async (userId, groupCode) => {
    return await Attendance.find({
        member: userId,
        groupCode,
        fineAmount: { $gt: 0 }
    })
        .populate('meeting', 'title date status')
        .sort({ createdAt: -1 });
};
