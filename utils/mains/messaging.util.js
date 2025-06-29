const nodemailer = require('nodemailer');
const { log } = require(MAIN_UTILS + 'logger.util');
const { ucFirst }  = require(MAIN_UTILS + 'general.util');
const { queueMessaging } = require(QUEUES + 'messagingQueue');
const EmailService = require(SERVICE_UTILS + 'messaging/EmailService');
const SmsService = require(SERVICE_UTILS + 'messaging/SmsService');
const WhatsAppService = require(SERVICE_UTILS + 'messaging/WhatsAppService');
const PushNotificationService = require(SERVICE_UTILS + 'messaging/PushNotificationService');


const logInfo = (type, data) => log(type, data, 'info');

const logError = (type, data) => log(type, data, 'error');

const sendMessage = async (data, type) => {
    const messageData = data;

    if(type === 'queue'){
        queueMessaging(data);
        return ;
    }


    switch (data.send_medium) {
        case 'email':
            return await EmailService.send(messageData);

        case 'whatsapp':
            return await WhatsAppService.send(messageData);

        case 'sms':
            return await SmsService.send(messageData);

        case 'push_notification':
            return await PushNotificationService.send(messageData);

        default:
            throw new Error(`Unsupported send_medium: ${data.send_medium}`);
    }
};





module.exports = {
    sendMessage,
    // subjectTemplate,
    // messageTemplate,
    // htmlEmailTemplate,
};
