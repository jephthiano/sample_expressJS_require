const nodemailer = require('nodemailer');
const { sendMessageDTO } = require('#dto/messaging.dto');
const { log } = require('#main_util/logger.util');

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

class PushNotificationService {
    
    static async send(data) {
        data = sendMessageDTO(data);

        try {
            logInfo('PUSH NOTIFICATION SERVICE', data);
            return true;
        } catch (err) {
            logError('PUSH NOTIFICATION SERVICE', err);
            return false;
        }
    }
}

module.exports = PushNotificationService;
