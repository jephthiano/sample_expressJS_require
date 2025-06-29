const nodemailer = require('nodemailer');
const { sendMessageDTO } = require('@dto/messaging.dto');

class SmsService {

    static async send(data) {
        data = sendMessageDTO(data);

        try {
            console.log(data);
            return true;
        } catch (err) {
            //fix()
            logError('Send Email Message [MESSAGING]', err);
            return false;
        }
    }
}

module.exports = SmsService;
