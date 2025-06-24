const express = require('express');
const router = new express.Router();
const { sendMessage } = require(MAIN_UTILS + 'messaging.util');
const { sendMessageDTO } = require(DTOS + 'messaging.dto');

//LOGIN
router.get('/messaging', (req,res) => {
    const messageData = sendMessageDTO({
        first_name: 'Jephthaooh',
        receiving_medium: 'jephthahooh@gmail.com',
        type: 'welcome',
        send_medium: 'email',
    });
    sendMessage(messageData, 'queue');
    res.status(200).json({message:'working'});
});

module.exports = router;