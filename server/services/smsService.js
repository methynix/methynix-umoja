const normalizePhone = (phone) => {
    let p = String(phone || '').replace(/\s+/g, '');
    if (p.startsWith('+')) return p.slice(1);        // +255712345678 → 255712345678
    if (p.startsWith('0')) return '255' + p.slice(1); //  0712345678   → 255712345678
    return p;
};

const sendSMS = async (phone, message) => {
    const apiKey = process.env.MESEJI_API_KEY;
    const senderId = process.env.MESEJI_SENDER_ID || 'METHYNIX';

    const recipients = Array.isArray(phone) ? phone : [phone];
    const contacts = recipients.map(normalizePhone).join(', ');

    if (!apiKey) {
        console.log(`[SMS:meseji] (not configured) -> ${contacts}: ${message}`);
        return { skipped: true };
    }

    const body = { sender_id: senderId, message, contacts };
    console.log('[SMS:meseji] REQUEST ->', JSON.stringify(body));

    try {
        const res = await fetch('https://meseji.co.tz/api/v1/sms/send', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const statusCode = res.status;
        let json;
        try { json = await res.json(); } catch { json = { raw: await res.text() }; }
        console.log('[SMS:meseji] RESPONSE ->', statusCode, JSON.stringify(json));
        return json;
    } catch (err) {
        console.error('[SMS:meseji] failed:', err.message);
        return { error: err.message };
    }
};

module.exports = { sendSMS, normalizePhone };
