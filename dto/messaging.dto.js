const { subjectTemplate, messageTemplate }  = require(MAIN_UTILS + 'messaging.util');

function sendMessageDTO(data, type = 'email') {
    return {
        name: data.first_name?.trim(),
        receiver: data.receiving_medium?.trim(),
        subject: subjectTemplate(type),
        message: messageTemplate(type, data.send_medium, { code: data.code?.trim() }),
    };
}

module.exports = { sendMessageDTO };