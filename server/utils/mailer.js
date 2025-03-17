const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to, subject, text, html
        });
        console.log(`Email sent: `, info.messageId)
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (err){
        console.error(`Error sending email: `, err);
    }
}

module.exports = { sendEmail }