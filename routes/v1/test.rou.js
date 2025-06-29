const express = require('express');
const router = new express.Router();
const { sendMessage } = require('@main_util/messaging.util');


router.get('/messaging', (req,res) => {
    console.info('working')
    const messageData = {
        first_name: 'Jephthaooh',
        receiving_medium: 'jephthahooh@gmail.com',
        type: 'welcome',
        send_medium: 'email',
    };

    sendMessage(messageData, 'queue');
    res.status(200).json({message:'working'});
});

module.exports = router;