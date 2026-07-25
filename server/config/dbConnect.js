const mongoose = require('mongoose');
const User = require('../models/User');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);

        // Reconcile indexes with the schema. This drops the legacy GLOBAL-unique
        // phone_1 / email_1 indexes and builds the new per-group compound ones,
        // so the same phone can belong to several different groups.
        try {
            await User.syncIndexes();
            console.log(' User indexes synced (phone/email now unique per group)');
        } catch (indexErr) {
            console.error(` Warning: could not sync User indexes: ${indexErr.message}`);
        }
    } catch (error) {
        console.error(` Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = dbConnect;