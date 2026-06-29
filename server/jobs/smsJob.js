const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { sendSMS } = require('../services/smsService');
const sms = require('../services/smsTemplates');

const runReminder = async (label) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const members = await User.find({ role: { $in: ['member', 'secretary', 'admin'] } }).select('name phone');

    for (const member of members) {
        const paid = await Transaction.findOne({
            member: member._id,
            type: 'share',
            month,
            year,
        });

        if (!paid && member.phone) {
            const msgFn = label === 'Katikati ya mwezi' ? sms.shareReminderMidMonth : sms.shareReminderEndMonth;
            await sendSMS(member.phone, msgFn({ name: member.name }));
        }
    }
};

const lastDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const day = today.getDate();

    if (day === 15) {
        await runReminder('Katikati ya mwezi');
    } else if (day === lastDayOfMonth(today)) {
        await runReminder('Mwisho wa mwezi');
    }
}, { timezone: 'Africa/Dar_es_Salaam' });

module.exports = { runReminder };
