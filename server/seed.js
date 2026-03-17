// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Futa kama yupo tayari ili tusiwe na duplicates
        await User.findOneAndDelete({ phone: '0684295726' });


        await User.create({
            name: 'methynix_software',
            phone: '0684295726',
            password: '1234ayman',
            role: 'superadmin', // Au 'superadmin' kama umeongeza kwenye enum
            groupCode: 'SYSTEM_GLOBAL',
            shares: 999999,
            socialFund: 999999
        });

        console.log('✅ Super Admin "methynix_software" created successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedSuperAdmin();