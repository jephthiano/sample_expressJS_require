const nodemailer = require('nodemailer');
const { sendMessageDTO } = require(DTOS + 'messaging.dto');

class WhatsAppService {

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

module.exports = WhatsAppService;
