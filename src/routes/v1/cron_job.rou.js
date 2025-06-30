const express = require('express');
const router = new express.Router();

const General = require('@main_util/general.cla');
const Security = require('@main_util/Security.cla');


//WAKE UP
router.get('/wake_up', async(req,res) => {
    console.log('Server still up and running at', new Date());
    
    let response = { status: true }

    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;