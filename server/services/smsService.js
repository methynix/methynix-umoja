const PROVIDER = (process.env.SMS_PROVIDER || 'africastalking').toLowerCase();

const normalizePhone = (phone) => {
    let p = String(phone || '').replace(/\s+/g, '');
    if (p.startsWith('+')) return p;
    if (p.startsWith('0')) return '+255' + p.slice(1);
    if (p.startsWith('255')) return '+' + p;
    return p;
};

const sendViaAfricasTalking = async (to, message) => {
    const username = process.env.AT_USERNAME;
    const apiKey = process.env.AT_API_KEY;
    const base =
        username === 'sandbox'
            ? 'https://api.sandbox.africastalking.com/version1/messaging'
            : 'https://api.africastalking.com/version1/messaging';

    const body = new URLSearchParams({
        username,
        to: to.join(','),
        message,
    });
    if (process.env.AT_SENDER_ID) body.append('from', process.env.AT_SENDER_ID);

    const res = await fetch(base, {
        method: 'POST',
        headers: {
            apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body,
    });
    return res.json();
};

const sendViaBeem = async (to, message) => {
    const apiKey = process.env.BEEM_API_KEY;
    const secretKey = process.env.BEEM_SECRET_KEY;
    const token = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

    const res = await fetch('https://apisms.beem.africa/v1/send', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            source_addr: process.env.BEEM_SENDER_ID || 'INFO',
            encoding: 0,
            message,
            recipients: to.map((dest, i) => ({
                recipient_id: i + 1,
                dest_addr: dest.replace('+', ''),
            })),
        }),
    });
    return res.json();
};

const sendSMS = async (phone, message) => {
    const recipients = (Array.isArray(phone) ? phone : [phone]).map(normalizePhone);

    const configured =
        PROVIDER === 'beem'
            ? process.env.BEEM_API_KEY && process.env.BEEM_SECRET_KEY
            : process.env.AT_USERNAME && process.env.AT_API_KEY;

    if (!configured) {
        console.log(`[SMS:${PROVIDER}] (not configured) -> ${recipients.join(', ')}: ${message}`);
        return { skipped: true };
    }

    try {
        const result =
            PROVIDER === 'beem'
                ? await sendViaBeem(recipients, message)
                : await sendViaAfricasTalking(recipients, message);
        console.log(`[SMS:${PROVIDER}] sent -> ${recipients.join(', ')}`);
        return result;
    } catch (err) {
        console.error(`[SMS:${PROVIDER}] failed:`, err.message);
        return { error: err.message };
    }
};

module.exports = { sendSMS, normalizePhone };
