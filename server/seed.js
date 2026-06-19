const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Group = require('./models/Group');

const seedTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await User.deleteMany({ role: { $ne: 'superadmin' } });
        await Group.deleteMany({});

        const group1 = await Group.create({
            name: "MSHIKAMANO VICOBA",
            groupCode: "111111"
        });

        const group2 = await Group.create({
            name: "UPENDO VICOBA",
            groupCode: "222222"
        });

        const users = [
            { name: "Admin Mshikamano", phone: "0711111111", role: "admin", groupId: group1._id, groupCode: "111111" },
            { name: "Secretary Mshikamano", phone: "0711111112", role: "secretary", groupId: group1._id, groupCode: "111111" },
            { name: "Member One A", phone: "0711111113", role: "member", groupId: group1._id, groupCode: "111111" },
            { name: "Member Two A", phone: "0711111114", role: "member", groupId: group1._id, groupCode: "111111" },
            { name: "Member Three A", phone: "0711111115", role: "member", groupId: group1._id, groupCode: "111111" },
            { name: "Member Four A", phone: "0711111116", role: "member", groupId: group1._id, groupCode: "111111" },

            { name: "Admin Upendo", phone: "0722222221", role: "admin", groupId: group2._id, groupCode: "222222" },
            { name: "Secretary Upendo", phone: "0722222222", role: "secretary", groupId: group2._id, groupCode: "222222" },
            { name: "Member One B", phone: "0722222223", role: "member", groupId: group2._id, groupCode: "222222" },
            { name: "Member Two B", phone: "0722222224", role: "member", groupId: group2._id, groupCode: "222222" },
            { name: "Member Three B", phone: "0722222225", role: "member", groupId: group2._id, groupCode: "222222" },
            { name: "Member Four B", phone: "0722222226", role: "member", groupId: group2._id, groupCode: "222222" }
        ];

        for (let u of users) {
            await User.create({
                ...u,
                password: "123456",
                shares: 0,
                socialFund: 0
            });
        }

        process.exit();
    } catch (error) {
        process.exit(1);
    }
};

seedTestData();