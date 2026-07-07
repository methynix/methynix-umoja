/*
 * Isolated end-to-end test harness.
 * - Spins up an in-memory MongoDB (zero impact on production Atlas).
 * - Seeds a realistic group (admin, secretary, treasurer, member) + superadmin.
 * - Boots the real Express app against the in-memory DB.
 * - Drives EVERY endpoint over real HTTP and reports pass/fail.
 *
 * Run:  node test-harness.js
 */

// ── 1. Lock down env BEFORE anything loads real .env ─────────────────────────
process.env.PORT = '5055';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_harness_only';
process.env.JWT_EXPIRES_IN = '1d';
process.env.CLIENT_URL = 'http://localhost:5173';
// Disable real SMS / email so no messages go to fake numbers.
process.env.MESEJI_API_KEY = '';
process.env.SMTP_HOST = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';

const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const BASE = `http://localhost:${process.env.PORT}/api/v1`;

// ── tiny test runner ─────────────────────────────────────────────────────────
const results = [];
let currentGroup = 'general';
function section(name) { currentGroup = name; }
async function test(name, fn) {
    try {
        await fn();
        results.push({ group: currentGroup, name, ok: true });
        console.log(`  ✓ ${name}`);
    } catch (err) {
        results.push({ group: currentGroup, name, ok: false, err: err.message });
        console.log(`  ✗ ${name}\n      -> ${err.message}`);
    }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

async function api(method, url, { token, body } = {}) {
    const res = await fetch(BASE + url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try { json = await res.json(); } catch { /* 204 etc */ }
    return { status: res.status, body: json };
}

// ── main ─────────────────────────────────────────────────────────────────────
(async () => {
    console.log('Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;

    await mongoose.connect(uri);
    console.log('Seeding test data...\n');

    const User = require('./models/User');
    const Group = require('./models/Group');
    const Settings = require('./models/Settings');
    const PhoneOTP = require('./models/PhoneOTP');
    const PasswordResetOTP = require('./models/PasswordResetOTP');
    const MemberVerificationToken = require('./models/MemberVerificationToken');

    // Maintenance off
    await Settings.findOneAndUpdate({ key: 'maintenance' }, { key: 'maintenance', value: false }, { upsert: true });

    // Group with full financial settings so contribution & fine flows work
    const group = await Group.create({
        name: 'TEST VICOBA', groupCode: 'TST100', type: 'vicoba',
        shareValue: 5000, socialFundAmount: 1000, mawazoAmount: 500,
        loanThreshold: 100000, lateFineAmount: 2000, absentFineAmount: 5000,
    });

    const mk = async (name, phone, role) => User.create({
        name, phone, password: '123456', role, groupId: group._id, groupCode: 'TST100', status: 'active',
    });
    const superadmin = await User.create({ name: 'Super', phone: '0000000000', password: 'glow_admin_2024', role: 'superadmin', groupCode: 'SYSTEM_GLOBAL' });
    const admin = await mk('Admin Test', '0710000001', 'admin');
    const secretary = await mk('Sec Test', '0710000002', 'secretary');
    const treasurer = await mk('Tre Test', '0710000003', 'treasurer');
    const member = await mk('Mem Test', '0710000004', 'member');
    group.creator = admin._id; await group.save();

    // Seed a phone OTP (code 123456) so registration can be tested
    await PhoneOTP.create({ phone: '0719999999', otpHash: await bcrypt.hash('123456', 10), expiresAt: new Date(Date.now() + 600000), attempts: 0 });
    // Seed a password-reset OTP for the admin (code 654321)
    admin.email = 'admintest@example.com'; await admin.save({ validateBeforeSave: false });
    await PasswordResetOTP.create({ phone: '0710000001', otpHash: await bcrypt.hash('654321', 10), expiresAt: new Date(Date.now() + 600000), attempts: 0 });
    // Seed a pending member + verification token
    const pending = await User.create({ name: 'Pending Guy', phone: '0718888888', password: 'placeholder_pw_unknown', role: 'member', status: 'pending', groupId: group._id, groupCode: 'TST100' });
    await MemberVerificationToken.create({ userId: pending._id, token: 'verifytoken123', expiresAt: new Date(Date.now() + 3600000) });

    // ── Boot the real app against the in-memory DB ───────────────────────────
    require('./server.js');
    await new Promise(r => setTimeout(r, 2000)); // wait for listen

    const tokens = {};

    // ═══════════════════ AUTH ═══════════════════
    section('AUTH');
    await test('POST /auth/otp/request', async () => {
        const r = await api('POST', '/auth/otp/request', { body: { phone: '0712345678' } });
        assert(r.status === 200, `expected 200 got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    let regToken;
    await test('POST /auth/register (new group+admin, valid OTP)', async () => {
        const r = await api('POST', '/auth/register', { body: {
            name: 'New Admin', phone: '0719999999', password: 'secret1', confirmPassword: 'secret1',
            groupCode: 'NEW200', groupName: 'NEW GROUP', type: 'vicoba', shareValue: 1000, otp: '123456',
        }});
        assert(r.status === 201, `expected 201 got ${r.status}: ${JSON.stringify(r.body)}`);
        assert(r.body.token, 'no token returned');
        regToken = r.body.token;
    });
    await test('POST /auth/login (admin)', async () => {
        const r = await api('POST', '/auth/login', { body: { phone: '0710000001', password: '123456', groupCode: 'TST100' } });
        assert(r.status === 200, `expected 200 got ${r.status}: ${JSON.stringify(r.body)}`);
        tokens.admin = r.body.token;
    });
    await test('POST /auth/login secretary/treasurer/member/superadmin', async () => {
        for (const [k, phone, pw] of [['secretary','0710000002','123456'],['treasurer','0710000003','123456'],['member','0710000004','123456'],['superadmin','0000000000','glow_admin_2024']]) {
            const r = await api('POST', '/auth/login', { body: { phone, password: pw } });
            assert(r.status === 200, `${k} login expected 200 got ${r.status}: ${JSON.stringify(r.body)}`);
            tokens[k] = r.body.token;
        }
    });
    await test('POST /auth/login (wrong password rejected)', async () => {
        const r = await api('POST', '/auth/login', { body: { phone: '0710000001', password: 'wrong' } });
        assert(r.status === 401, `expected 401 got ${r.status}`);
    });
    await test('GET /auth/me', async () => {
        const r = await api('GET', '/auth/me', { token: tokens.admin });
        assert(r.status === 200 && r.body.data.user.phone === '0710000001', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /auth/update-password', async () => {
        const r = await api('PATCH', '/auth/update-password', { token: tokens.member, body: { oldPassword: '123456', newPassword: 'newpass1' } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
        // revert so later member login-dependent tests still work via token (token already held)
    });
    await test('POST /auth/password-reset/request (generic ok)', async () => {
        const r = await api('POST', '/auth/password-reset/request', { body: { phone: '0710000001', email: 'admintest@example.com' } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    let resetToken;
    await test('POST /auth/password-reset/verify (seeded OTP)', async () => {
        // The request step above upserts a fresh (unreadable) OTP; replace it with a
        // known hash so we can drive verify -> confirm exactly as the real flow does.
        await PasswordResetOTP.findOneAndUpdate(
            { phone: '0710000001' },
            { otpHash: await bcrypt.hash('654321', 10), expiresAt: new Date(Date.now() + 600000), attempts: 0 },
            { upsert: true }
        );
        const r = await api('POST', '/auth/password-reset/verify', { body: { phone: '0710000001', otp: '654321' } });
        assert(r.status === 200 && r.body.data.resetToken, `got ${r.status}: ${JSON.stringify(r.body)}`);
        resetToken = r.body.data.resetToken;
    });
    await test('POST /auth/password-reset/confirm', async () => {
        const r = await api('POST', '/auth/password-reset/confirm', { body: { resetToken, newPassword: 'reset123', confirmPassword: 'reset123' } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /auth/verify-member/:token', async () => {
        const r = await api('GET', '/auth/verify-member/verifytoken123');
        assert(r.status === 200 && r.body.data.phone === '0718888888', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /auth/verify-member/:token/approve', async () => {
        const r = await api('POST', '/auth/verify-member/verifytoken123/approve', { body: { newPassword: 'member12', confirmPassword: 'member12' } });
        assert(r.status === 200 && r.body.token, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });

    // ═══════════════════ GROUP SETTINGS / USERS (needed before contributions) ═══
    section('GROUPS & USERS');
    await test('GET /groups/summary (admin)', async () => {
        const r = await api('GET', '/groups/summary', { token: tokens.admin });
        assert(r.status === 200 && r.body.data.summary, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /groups/settings (admin)', async () => {
        const r = await api('PATCH', '/groups/settings', { token: tokens.admin, body: { shareValue: 5000, socialFundAmount: 1000, mawazoAmount: 500, lateFineAmount: 2000, absentFineAmount: 5000, loanThreshold: 100000 } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /groups (superadmin)', async () => {
        const r = await api('GET', '/groups', { token: tokens.superadmin });
        assert(r.status === 200 && Array.isArray(r.body.data.groups), `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /groups/:id/members (superadmin)', async () => {
        const r = await api('GET', `/groups/${group._id}/members`, { token: tokens.superadmin });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /users/members (admin, scoped)', async () => {
        const r = await api('GET', '/users/members', { token: tokens.admin });
        assert(r.status === 200 && r.body.results >= 4, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    let createdMemberId;
    await test('POST /users/members (admin creates member)', async () => {
        const r = await api('POST', '/users/members', { token: tokens.admin, body: { name: 'Fresh Member', phone: '0717777777', role: 'member' } });
        assert(r.status === 201 && r.body.data.member._id, `got ${r.status}: ${JSON.stringify(r.body)}`);
        createdMemberId = r.body.data.member._id;
    });
    await test('DELETE /users/members/:id (admin)', async () => {
        const r = await api('DELETE', `/users/members/${createdMemberId}`, { token: tokens.admin });
        assert(r.status === 204, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /users/members forbidden for member role', async () => {
        const r = await api('POST', '/users/members', { token: tokens.member, body: { name: 'X', phone: '0716666666' } });
        assert(r.status === 403, `expected 403 got ${r.status}`);
    });

    // ═══════════════════ TRANSACTIONS / CONTRIBUTIONS ═══════════════════
    section('TRANSACTIONS');
    const memberId = member._id.toString();
    await test('POST /transactions/record (share)', async () => {
        const r = await api('POST', '/transactions/record', { token: tokens.admin, body: { memberId, type: 'share', shares: 3 } });
        assert(r.status === 201 && r.body.data.transaction.amount === 15000, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /transactions/record (social_fund)', async () => {
        const r = await api('POST', '/transactions/record', { token: tokens.admin, body: { memberId, type: 'social_fund' } });
        assert(r.status === 201 && r.body.data.transaction.amount === 1000, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /transactions/record (mawazo)', async () => {
        const r = await api('POST', '/transactions/record', { token: tokens.admin, body: { memberId, type: 'mawazo' } });
        assert(r.status === 201 && r.body.data.transaction.amount === 500, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /transactions/my-ledger (member)', async () => {
        const r = await api('GET', '/transactions/my-ledger', { token: tokens.member });
        assert(r.status === 200 && Array.isArray(r.body.data.ledger) && r.body.data.ledger.length === 12, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /transactions/my-history (member)', async () => {
        const r = await api('GET', '/transactions/my-history', { token: tokens.member });
        assert(r.status === 200 && r.body.data.transactions.length >= 3, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });

    // ═══════════════════ LOANS ═══════════════════
    section('LOANS');
    let loanId;
    await test('POST /loans/request (member)', async () => {
        const r = await api('POST', '/loans/request', { token: tokens.member, body: {
            amount: 50000, purpose: 'Biashara',
            guarantorInternalName: 'Sec Test', guarantorInternalPhone: '0710000002',
            guarantorExternalName: 'John Nje', guarantorExternalPhone: '0715555555',
            applicantSignature: 'data:image/png;base64,AAA',
        }});
        assert(r.status === 201 && r.body.data.loan._id, `got ${r.status}: ${JSON.stringify(r.body)}`);
        loanId = r.body.data.loan._id;
    });
    await test('GET /loans/my-loans (member)', async () => {
        const r = await api('GET', '/loans/my-loans', { token: tokens.member });
        assert(r.status === 200 && r.body.results >= 1, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /loans/group-loans (admin)', async () => {
        const r = await api('GET', '/loans/group-loans', { token: tokens.admin });
        assert(r.status === 200 && r.body.results >= 1, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /loans/:id/sign (treasurer)', async () => {
        const r = await api('PATCH', `/loans/${loanId}/sign`, { token: tokens.treasurer, body: { signature: 'data:image/png;base64,TRE' } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /loans/:id/sign (secretary)', async () => {
        const r = await api('PATCH', `/loans/${loanId}/sign`, { token: tokens.secretary, body: { signature: 'data:image/png;base64,SEC' } });
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /loans/:id/status approve (admin, both signatures present)', async () => {
        const r = await api('PATCH', `/loans/${loanId}/status`, { token: tokens.admin, body: { status: 'approved' } });
        assert(r.status === 200 && r.body.data.loan.status === 'approved', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /loans/:id/repay (admin)', async () => {
        const r = await api('PATCH', `/loans/${loanId}/repay`, { token: tokens.admin });
        assert(r.status === 200 && r.body.data.loan.status === 'paid', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });

    // ═══════════════════ MEETINGS ═══════════════════
    section('MEETINGS');
    let meetingId, attendanceId;
    await test('POST /meetings (leader creates)', async () => {
        const r = await api('POST', '/meetings', { token: tokens.secretary, body: { title: 'Weekly Meeting', type: 'regular' } });
        assert(r.status === 201 && r.body.data.meeting._id, `got ${r.status}: ${JSON.stringify(r.body)}`);
        meetingId = r.body.data.meeting._id;
    });
    await test('GET /meetings (list)', async () => {
        const r = await api('GET', '/meetings', { token: tokens.secretary });
        assert(r.status === 200 && r.body.data.meetings.length >= 1, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /meetings/:id (detail)', async () => {
        const r = await api('GET', `/meetings/${meetingId}`, { token: tokens.secretary });
        assert(r.status === 200 && Array.isArray(r.body.data.members), `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /meetings/:id/attendance (member absent -> fine)', async () => {
        const r = await api('POST', `/meetings/${meetingId}/attendance`, { token: tokens.secretary, body: { records: [
            { memberId: member._id.toString(), status: 'absent' },
            { memberId: treasurer._id.toString(), status: 'late' },
            { memberId: admin._id.toString(), status: 'present' },
        ]}});
        assert(r.status === 200, `got ${r.status}: ${JSON.stringify(r.body)}`);
        const memRec = r.body.data.attendance.find(a => String(a.member._id) === member._id.toString());
        assert(memRec && memRec.fineAmount === 5000, `expected 5000 fine, got ${JSON.stringify(memRec)}`);
        attendanceId = memRec._id;
    });
    await test('PATCH /meetings/:id/fines/:attendanceId/pay', async () => {
        const r = await api('PATCH', `/meetings/${meetingId}/fines/${attendanceId}/pay`, { token: tokens.secretary });
        assert(r.status === 200 && r.body.data.record.finePaid === true, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /meetings/my-fines (member)', async () => {
        const r = await api('GET', '/meetings/my-fines', { token: tokens.member });
        assert(r.status === 200 && r.body.data.fines.length >= 1, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('PATCH /meetings/:id/close', async () => {
        const r = await api('PATCH', `/meetings/${meetingId}/close`, { token: tokens.secretary });
        assert(r.status === 200 && r.body.data.meeting.status === 'closed', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });

    // ═══════════════════ STATS & SETTINGS ═══════════════════
    section('STATS & SETTINGS');
    await test('GET /stats/global (superadmin)', async () => {
        const r = await api('GET', '/stats/global', { token: tokens.superadmin });
        assert(r.status === 200 && typeof r.body.data.totalUsers === 'number', `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('GET /stats/global forbidden for admin', async () => {
        const r = await api('GET', '/stats/global', { token: tokens.admin });
        assert(r.status === 403, `expected 403 got ${r.status}`);
    });
    await test('GET /settings/maintenance', async () => {
        const r = await api('GET', '/settings/maintenance', { token: tokens.admin });
        assert(r.status === 200 && r.body.data.value === false, `got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /settings/maintenance (superadmin toggles on/off)', async () => {
        let r = await api('POST', '/settings/maintenance', { token: tokens.superadmin, body: { value: true } });
        assert(r.status === 200 && r.body.data.maintenance === true, `on: got ${r.status}: ${JSON.stringify(r.body)}`);
        // While on, a normal protected route should 503
        const blocked = await api('GET', '/users/members', { token: tokens.admin });
        assert(blocked.status === 503, `expected 503 during maintenance, got ${blocked.status}`);
        r = await api('POST', '/settings/maintenance', { token: tokens.superadmin, body: { value: false } });
        assert(r.status === 200 && r.body.data.maintenance === false, `off: got ${r.status}: ${JSON.stringify(r.body)}`);
    });
    await test('POST /settings/maintenance forbidden for admin', async () => {
        const r = await api('POST', '/settings/maintenance', { token: tokens.admin, body: { value: true } });
        assert(r.status === 403, `expected 403 got ${r.status}`);
    });

    // ── report ───────────────────────────────────────────────────────────────
    const passed = results.filter(r => r.ok).length;
    const failed = results.filter(r => !r.ok);
    console.log('\n────────────────────────────────────────');
    console.log(`RESULT: ${passed}/${results.length} passed, ${failed.length} failed`);
    if (failed.length) {
        console.log('\nFAILURES:');
        failed.forEach(f => console.log(`  [${f.group}] ${f.name}\n     -> ${f.err}`));
    }
    console.log('────────────────────────────────────────');

    await mongoose.disconnect();
    await mongod.stop();
    process.exit(failed.length ? 1 : 0);
})().catch(err => { console.error('HARNESS CRASH:', err); process.exit(2); });
