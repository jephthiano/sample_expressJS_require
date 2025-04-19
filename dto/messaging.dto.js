const { subjectTemplate, messageTemplate }  = require(MAIN_UTILS + 'messaging.util');

function sendMessageDTO(data, type = 'email') {
    const send_medium = data.send_medium || 'email';

    return {
        first_name: data.first_name?.trim(),
        receiving_medium: data.receiving_medium?.trim(),
        subject: subjectTemplate(type),
        message: messageTemplate(type, send_medium, {
            code: data.code?.trim() || null
        }),
    };
}

module.exports = { sendMessageDTO };
