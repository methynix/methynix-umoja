const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { sendSMS } = require('../services/smsService');
const sms = require('../services/smsTemplates');

const runReminder = async (label) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const members = await User.find({ 
        role: { $in: ['member', 'secretary', 'admin'] },
        phone: { $exists: true, $ne: '' }
    }).select('name phone');

    
    if (members.length === 0) return;

    const transactions = await Transaction.find({
        type: 'share',
        month,
        year
    }).select('member');

    const paidMemberIds = new Set(transactions.map(t => t.member.toString()));

    const msgFn = label === 'Katikati ya mwezi' ? sms.shareReminderMidMonth : sms.shareReminderEndMonth;

    const smsPromises = members
        .filter(member => !paidMemberIds.has(member._id.toString()))
        .map(member => {
            const message = msgFn({ name: member.name });
            return sendSMS(member.phone, message);
        });

    if (smsPromises.length > 0) {
        console.log(`[Cron:Reminder] Inatuma SMS ${smsPromises.length} kwa wasiolipa...`);
        await Promise.all(smsPromises);
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