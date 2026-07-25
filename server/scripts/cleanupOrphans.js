/**
 * One-off maintenance: remove data left behind when a Group was deleted
 * directly in the database (which does NOT cascade to members/loans/etc.).
 *
 * Deletes every User (except superadmins), Loan, Contribution, Meeting,
 * Transaction and Attendance record whose group no longer exists.
 *
 * Usage (from the /server folder):
 *     node scripts/cleanupOrphans.js          # dry run — shows counts only
 *     node scripts/cleanupOrphans.js --delete # actually deletes
 */
require('dotenv').config();
const mongoose = require('mongoose');

const Group = require('../models/Group');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Contribution = require('../models/Contribution');
const Meeting = require('../models/Meeting');
const Transaction = require('../models/Transaction');
const Attendance = require('../models/Attendance');

const APPLY = process.argv.includes('--delete');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected. Mode: ${APPLY ? 'DELETE' : 'DRY RUN (add --delete to apply)'}\n`);

    const groups = await Group.find().select('_id groupCode');
    const liveIds = new Set(groups.map((g) => String(g._id)));
    const liveCodes = new Set(groups.map((g) => g.groupCode));

    // Users: orphaned when they have a groupId that no longer exists.
    // Superadmins are global (no group) and are always kept.
    const orphanUsers = (await User.find({ role: { $ne: 'superadmin' } }).select('_id name phone groupId groupCode'))
        .filter((u) => !u.groupId || !liveIds.has(String(u.groupId)));

    const byCode = (Model, field = 'groupCode') => Model.find().select(`_id ${field}`)
        .then((docs) => docs.filter((d) => {
            const v = d[field];
            if (v == null) return true; // no group reference at all → orphan
            return field === 'groupId' ? !liveIds.has(String(v)) : !liveCodes.has(v);
        }).map((d) => d._id));

    const [orphanLoans, orphanContribs, orphanMeetings, orphanTx, orphanAtt] = await Promise.all([
        byCode(Loan, 'groupCode'),
        byCode(Contribution, 'groupId'),
        byCode(Meeting, 'groupId'),
        byCode(Transaction, 'groupId'),
        byCode(Attendance, 'groupCode'),
    ]);

    console.log(`Live groups:        ${groups.length}`);
    console.log(`Orphan users:       ${orphanUsers.length}`);
    console.log(`Orphan loans:       ${orphanLoans.length}`);
    console.log(`Orphan contributions:${orphanContribs.length}`);
    console.log(`Orphan meetings:    ${orphanMeetings.length}`);
    console.log(`Orphan transactions:${orphanTx.length}`);
    console.log(`Orphan attendance:  ${orphanAtt.length}\n`);

    if (orphanUsers.length) {
        console.log('Users that would be removed:');
        orphanUsers.forEach((u) => console.log(`  - ${u.name} (${u.phone})`));
        console.log('');
    }

    if (APPLY) {
        const userIds = orphanUsers.map((u) => u._id);
        const r = await Promise.all([
            User.deleteMany({ _id: { $in: userIds } }),
            Loan.deleteMany({ _id: { $in: orphanLoans } }),
            Contribution.deleteMany({ _id: { $in: orphanContribs } }),
            Meeting.deleteMany({ _id: { $in: orphanMeetings } }),
            Transaction.deleteMany({ _id: { $in: orphanTx } }),
            Attendance.deleteMany({ _id: { $in: orphanAtt } }),
        ]);
        console.log('Deleted:', r.map((x) => x.deletedCount).join(', '));
    } else {
        console.log('Nothing deleted (dry run). Re-run with --delete to apply.');
    }

    await mongoose.disconnect();
    process.exit(0);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
