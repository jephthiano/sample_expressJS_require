const nodemailer = require('nodemailer');
const { log } = require(MAIN_UTILS + 'logger.util');
const { ucFirst }  = require(MAIN_UTILS + 'general.util');
const { queueMessaging } = require(QUEUES + 'messagingQueue');
const EmailService = require(SERVICE_UTILS + 'messaging/EmailService');


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
            return await sendWhatsappMessage(messageData);

        case 'sms':
            return await sendSmsMessage(messageData);

        case 'push_notification':
            return await sendPushNotification(messageData);

        default:
            throw new Error(`Unsupported send_medium: ${data.send_medium}`);
    }
};

const sendWhatsappMessage = async (data) => {
    console.log(data);
    return false;
};

const sendSmsMessage = async (data) => {
    console.log(data);
    return false;
};

const sendPushNotification = async (data) => {
    console.log(data);
    return false;
};



const subjectTemplate = (type) => {
    const subjects = {
        welcome: 'WELCOME TO JEPH VTU',
        otp_code: 'Request for OTP Code',
        reset_password: 'Reset Password',
        // update_password: 'Update Password',
        // receive_fund_success: 'Incoming Transfer Successful',
        // card_payment: 'Card Funding Successful',
        // set_pin: 'Pin Setup',
        // change_pin: 'Pin Update',
    };
    return subjects[type] || '';
};

const messageTemplate = (type, medium = 'email', data = {}) => {
    const messages = {
        welcome: 'You have successfully registered with Jeph VTU. We are delighted to have you as our customer.',
        otp_code: `Your OTP code is ${data.code}. Please note that this code expires in 5 minutes. Do not share this code with anyone.`,
        reset_password: 'You have successfully reset your password. If this action was not performed by you, kindly reset your password or notify the admin.',
        // update_password: 'You have successfully updated your password. If this action was not performed by you, kindly reset your password or notify the admin.',
        // receive_fund_success: `${data.senderName} has sent you NGN ${data.amount}`,
        // card_payment: `Card funding of ${data.amount} NGN was successful.`,
        // set_pin: 'You have successfully set your PIN for secure transactions. If this action was not performed by you, kindly change your password and notify the admin.',
        // change_pin: 'You have successfully updated your PIN. If this action was not performed by you, kindly change your password or notify the admin.',
    };
    return messages[type] || '';
};

const htmlEmailTemplate = (data) => {
    const site_url = 'https://jeph-vtu.vercel.app';
    const media_url = 'https://jeph-vtu.vercel.app/media/logo.png';
    const company_name = 'Jeph VTU';

    return `
    <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
            <style>
                .j-j-text-shadow { text-shadow: 7px 3px 5px; }
                .j-text-color5 { color: #fff !important; }
                .j-text-color7 { color: #3a3a3a !important; }
            </style>
        </head>

        <body style="font-family: Roboto, sans-serif;">
            <div style="padding: 20px; width:98%; max-width:800px; font-size:15px; background-color:#e9e3e3; margin:0 auto;">
                <br>
                <center>
                    <a href="${site_url}" style="padding: 15px 10px; color: teal; text-decoration: none; font-size: 35px; cursor: pointer;">
                        <img src="${media_url}" alt="${company_name} LOGO IMAGE" style="width:98%; max-width:500px; height:70px;">
                    </a>
                    <br>
                </center>

                <div class="j-text-color5">
                    <p><b>Dear ${ucFirst(data.first_name)},</b></p>
                    <p>${data.message}</p>
                    <p>We appreciate your effort in being with us.</p>
                    <p>Best Regards.</p>
                    <p>${company_name} Team.</p><br>                           
                    <p>
                        You are receiving this mail because you are a registered member/user of 
                        <a href="${site_url}" style="color: #0072bf; text-decoration: none; cursor: pointer;">
                            <b>${company_name}</b>
                        </a>.
                    </p>
                    <p>If you did not request this email, kindly ignore it.</p>
                    <hr>
                    <div class="j-text-color5" style="font-family: Open Sans">
                        <center>
                            <p>Copyright ${new Date().getFullYear()} ${company_name} All rights reserved.</p>
                        </center>
                    </div>
                    <hr>
                </div>
                <br>
            </div>
        </body>
    </html>
    `;
};

module.exports = {
    sendMessage,
    sendWhatsappMessage,
    sendSmsMessage,
    sendPushNotification,
    subjectTemplate,
    messageTemplate,
    htmlEmailTemplate,
};
