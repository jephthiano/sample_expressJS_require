const express = require('express');
const router = new express.Router();
const Security = require('@main_util/Security.cla');
const { log } = require('@main_util/logger.util');


//WAKE UP
router.get('/wake_up', async(req,res) => {
    log('CRON JOB ROUTE','Server still up and running at', new Date());
    
    let response = { status: true }

    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;