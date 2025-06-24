const { subjectTemplate, messageTemplate } = require(MAIN_UTILS + 'messaging.util');

// pass [first_name, receiving_medium, send_medium, type and misc]
function sendMessageDTO(data) {
    const send_medium = data.send_medium || 'email';

    const match = {
        email: () => emailDTO(data),
        sms: () => smsDTO(data),
        whatsapp: () => whatsappDTO(data),
        push_notification: () => pushNotificationDTO(data),
    };
    

    return (match[send_medium] || match.email)(); // fallback to email
}

const emailDTO = (data) => {
    const send_medium = 'email';
    return {
        first_name: data.first_name?.trim(),
        receiving_medium: data.receiving_medium?.trim(),
        subject: subjectTemplate(data.type),
        send_medium,
        message: messageTemplate(data.type, send_medium, {
            code: data.code?.trim() || null,
        }),
    };
};

const smsDTO = (data) => {
    const send_medium = 'sms';
    return {
        first_name: data.first_name?.trim(),
        receiving_medium: data.receiving_medium?.trim(),
        send_medium,
        message: messageTemplate(data.type, send_medium, {
            code: data.code?.trim() || null,
        }),
    };
};

const whatsappDTO = (data) => {
    const send_medium = 'whatsapp';
    return {
        first_name: data.first_name?.trim(),
        receiving_medium: data.receiving_medium?.trim(),
        send_medium,
        message: messageTemplate(data.type, send_medium, {
            code: data.code?.trim() || null,
        }),
    };
};


const pushNotificationDTO = (data) => {
    const send_medium = 'push_notification';
    return {
        first_name: data.first_name?.trim(),
        receiving_medium: data.receiving_medium?.trim(),
        send_medium,
        message: messageTemplate(data.type, send_medium, {
            code: data.code?.trim() || null,
        }),
    };
};

module.exports = { sendMessageDTO };