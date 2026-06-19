const cron = require('node-cron');
const User = require('../models/User');
const Contribution = require('../models/Contribution');

const sendSMS = async (phone, message) => {
    console.log(`Sending SMS to ${phone}: ${message}`);
    // Hapa utaweka API yako ya SMS (Beem, Twilio, etc.)
};

const reminderJob = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const members = await User.find({ role: 'member' });

    for (let member of members) {
        const paid = await Contribution.findOne({ member: member._id, month, year });
        
        if (!paid) {
            const msg = `Habari ${member.name}, Methynix-Umoja inakukumbusha kulipa michango ya mwezi huu ili kuepuka faini.`;
            await sendSMS(member.phone, msg);
        }
    }
};

cron.schedule('0 9 15 * *', reminderJob);
cron.schedule('0 9 28-31 * *', reminderJob);