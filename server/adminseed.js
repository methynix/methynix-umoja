const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Group = require('./models/Group');
const Settings = require('./models/Settings');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await User.findOneAndDelete({ phone: '0000000000' });

        const superAdmin = await User.create({
            name: 'methynix_software',
            phone: '0000000000',
            password: 'glow_admin_2024',
            role: 'superadmin',
            groupCode: 'SYSTEM_GLOBAL',
            shares: 0,
            socialFund: 0
        });

        await Settings.findOneAndUpdate(
            { key: 'maintenance' },
            { key: 'maintenance', value: false },
            { upsert: true, new: true }
        );

        console.log('Super Admin created successfully');
        console.log('Phone: 0000000000');
        console.log('Password: glow_admin_2024');
        
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedSuperAdmin();