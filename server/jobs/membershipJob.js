const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const { sendSMS } = require('../services/smsService');
const sms = require('../services/smsTemplates');

const startOfWeek = (d) => {
    const x = new Date(d);
    const day = x.getDay() || 7;
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - (day - 1));
    return x;
};

const runMembershipCheck = async () => {
    const now = new Date();
    const curStart = startOfWeek(now);

    const w1Start = new Date(curStart); w1Start.setDate(w1Start.getDate() - 7);
    const w2Start = new Date(curStart); w2Start.setDate(w2Start.getDate() - 14);
    const w3Start = new Date(curStart); w3Start.setDate(w3Start.getDate() - 21);

    const windows = [
        { start: w3Start, end: w2Start },
        { start: w2Start, end: w1Start },
        { start: w1Start, end: curStart },
    ];

    const vicobaGroups = await Group.find({ type: 'vicoba' }).select('_id');
    const groupIds = vicobaGroups.map((g) => g._id);

    const members = await User.find({
        role: 'member',
        groupId: { $in: groupIds },
    }).select('name phone createdAt');

    for (const m of members) {
        if (new Date(m.createdAt) > w3Start) continue;

        const txns = await Transaction.find({
            member: m._id,
            type: { $in: ['share', 'social_fund', 'mawazo'] },
            createdAt: { $gte: w3Start, $lt: curStart },
        }).select('type createdAt');

        const defaultedAllThreeWeeks = windows.every((win) => {
            const inWin = txns.filter((t) => t.createdAt >= win.start && t.createdAt < win.end);
            const types = new Set(inWin.map((t) => t.type));
            const complete = types.has('share') && types.has('social_fund') && types.has('mawazo');
            return !complete;
        });

        if (defaultedAllThreeWeeks) {
            await User.findByIdAndDelete(m._id);
            if (m.phone) {
                sendSMS(m.phone, sms.memberRemoved({ name: m.name }));
            }
            console.log(`[membership] Removed ${m.name} (${m._id}) for 3-week default`);
        }
    }
};

cron.schedule('0 8 * * 1', runMembershipCheck, { timezone: 'Africa/Dar_es_Salaam' });

module.exports = { runMembershipCheck };
