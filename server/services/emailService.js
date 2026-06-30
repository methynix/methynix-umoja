const nodemailer = require('nodemailer');

let transporter = null;

const isConfigured = () =>
    Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async (to, subject, html) => {
    if (!isConfigured()) {
        console.log(`[EMAIL] (not configured) -> ${to}: ${subject}`);
        return { skipped: true };
    }

    try {
        const info = await getTransporter().sendMail({
            from: process.env.EMAIL_FROM || `Methynix Umoja <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`[EMAIL] sent -> ${to}: ${subject}`);
        return info;
    } catch (err) {
        console.error('[EMAIL] failed:', err.message);
        return { error: err.message };
    }
};

module.exports = { sendEmail, isConfigured };
