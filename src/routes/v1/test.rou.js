const express = require('express');
const router = new express.Router();
const { sendMessage } = require('#main_util/messaging.util');
const { hashPassword } = require('#main_util/security.util');


router.get('/messaging', async (req,res) => {
    // for email
    // const messageData = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: 'jephthahooh@gmail.com',
    //     type: 'welcome',
    //     send_medium: 'email',
    // };

    // for whatsapp
    // const messageData = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: '07047474438',
    //     type: 'welcome',
    //     send_medium: 'whatsapp',
    // };

    // for sms notification
    // const messageData = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: '07047474438',
    //     type: 'welcome',
    //     send_medium: 'sms',
    // };

    // for push notification
    const messageData = {
        first_name: 'Jephthaooh',
        receiving_medium: 'dfgvghvgvgdv',
        type: 'welcome',
        send_medium: 'push_notification',
    };

    sendMessage(messageData, 'queue');
    res.status(200).json({message:'working'});
});

router.get('/hash', async (req,res) => {
    const hash = await hashPassword('newPAss')
});




module.exports = router;