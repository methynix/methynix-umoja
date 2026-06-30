const passwordResetOTP = ({ name, code }) => ({
    subject: 'Methynix Umoja - Kuweka upya Password',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #14532d;">Methynix Umoja</h2>
            <p>Habari ${name},</p>
            <p>Umeomba kuweka upya password yako. Tumia nambari ifuatayo kuthibitisha:</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #14532d; text-align: center; margin: 24px 0;">${code}</p>
            <p>Nambari hii itatumika kwa dakika 10 pekee. Kama hukuomba hii, puuza ujumbe huu.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">© ${new Date().getFullYear()} Methynix Software</p>
        </div>
    `,
});

module.exports = { passwordResetOTP };
