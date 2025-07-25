const nodemailer = require('nodemailer');
const { sendMessageDTO } = require('@dto/messaging.dto');
const { log } = require('@main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

class SmsService {

    static async send(data) {
        data = sendMessageDTO(data);

        try {
            logInfo('SMS SERVICE', data);
            return true;
        } catch (err) {
            logError('SMS SERVICE', err);
            return false;
        }
    }
}

module.exports = SmsService;
