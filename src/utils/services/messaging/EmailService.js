const nodemailer = require('nodemailer');
const { sendMessageDTO } = require('#dto/core/messaging.dto');
const { getEnvorThrow } = require('#main_util/general.util');

class EmailService {
    static SMTP_HOST = getEnvorThrow('SMTP_HOST');
    static SMTP_PORT = parseInt(getEnvorThrow('SMTP_PORT'));
    static SMTP_USER = getEnvorThrow('SMTP_USER');
    static SMTP_PASS = getEnvorThrow('SMTP_PASS');

    static transporter = nodemailer.createTransport({
        host: EmailService.SMTP_HOST,
        port: EmailService.SMTP_PORT,
        secure: true,
        auth: {
            user: EmailService.SMTP_USER,
            pass: EmailService.SMTP_PASS,
        },
    });

    static async send(data) {
        data = sendMessageDTO(data);

        const mailOptions = {
            from: EmailService.SMTP_USER,
            to: data.receiving_medium,
            subject: data.subject,
            text: data.text_content,
            html: data.html_content,
        };

        await EmailService.transporter.sendMail(mailOptions);
    }
}

module.exports = EmailService;
