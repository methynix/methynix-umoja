/**
 * Centralised SMS message templates for Methynix Umoja.
 * All messages are in Swahili.
 * Each function receives named variables and returns a plain string.
 */

const APP = 'Methynix Umoja';

// ─── Authentication ────────────────────────────────────────────────────────────

const otp = ({ code }) =>
    `${APP}: Nambari yako ya uthibitisho ni *${code}*. Itatumika kwa dakika 10. Usimwambie mtu mwingine.`;

// ─── Member Management ────────────────────────────────────────────────────────

const memberVerification = ({ name, link }) =>
    `Karibu ${name} kwenye ${APP}! Bonyeza link hii kuthibitisha namba yako na kuweka password yako: ${link} (Halali kwa masaa 72)`;

const memberRemoved = ({ name }) =>
    `Habari ${name}, umeondolewa kwenye kikundi cha ${APP} kwa kukosa kutoa michango (hisa, jamii na mawazo) kwa wiki tatu mfululizo. Wasiliana na uongozi kwa maelezo zaidi.`;

// ─── Loans ────────────────────────────────────────────────────────────────────

const loanRequested = ({ name, amount }) =>
    `${APP}: Mwanachama ${name} amewasilisha ombi la mkopo wa TZS ${fmt(amount)}. Tafadhali kagua na usaini fomu kwenye mfumo.`;

const loanApproved = ({ name, amount }) =>
    `Habari ${name}! Ombi lako la mkopo wa TZS ${fmt(amount)} LIMEKUBALIWA na ${APP}. Wasiliana na katibu wako kupokea fedha. Asante!`;

const loanRejected = ({ name, amount }) =>
    `Habari ${name}, samahani, ombi lako la mkopo wa TZS ${fmt(amount)} HALIKUKUBALIWA. Wasiliana na uongozi wa kikundi kwa maelezo zaidi.`;

const loanRepaid = ({ name, amount }) =>
    `Habari ${name}, mkopo wako wa TZS ${fmt(amount)} UMEKAMILIKA kulipwa. Hongera! Akaunti yako iko safi. - ${APP}`;

const loanOverdue = ({ name, amount, dueDate }) =>
    `Habari ${name}, mkopo wako wa TZS ${fmt(amount)} umepita muda wake wa kulipwa (${dueDate}). Tafadhali lipa haraka ili kuepuka adhabu. - ${APP}`;

// ─── Contributions & Reminders ────────────────────────────────────────────────

const shareReminderMidMonth = ({ name }) =>
    `Habari ${name}, ${APP} inakukumbusha: Muda wa katikati ya mwezi umefika. Hakikisha umelipa hisa zako ili kuepuka faini.`;

const shareReminderEndMonth = ({ name }) =>
    `Habari ${name}, mwezi unakwisha! Bado haujafanya malipo ya hisa kwa mwezi huu. Lipa leo kuepuka faini. - ${APP}`;

// ─── Meetings & Fines ─────────────────────────────────────────────────────────

const meetingReminder = ({ name, title, date }) =>
    `Habari ${name}, kuna mkutano wa kikundi: "${title}" tarehe ${date}. Tafadhali hudhuria kwa wakati. - ${APP}`;

const fineIssued = ({ name, amount, reason }) =>
    `Habari ${name}, umewekwa faini ya TZS ${fmt(amount)} kwa sababu ya: ${reason}. Lipa kwa katibu wako. - ${APP}`;

const finePaid = ({ name, amount }) =>
    `Habari ${name}, faini yako ya TZS ${fmt(amount)} imerekodiwa kulipwa. Asante! - ${APP}`;

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmt = (n) => Number(n).toLocaleString('en-TZ');

module.exports = {
    otp,
    memberVerification,
    memberRemoved,
    loanRequested,
    loanApproved,
    loanRejected,
    loanRepaid,
    loanOverdue,
    shareReminderMidMonth,
    shareReminderEndMonth,
    meetingReminder,
    fineIssued,
    finePaid,
};
