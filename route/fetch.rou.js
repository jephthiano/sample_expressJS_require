const express = require('express');
const router = new express.Router();

const General = require(MAIN_UTILS + 'general.cla');
const Security = require(MAIN_UTILS + 'Security.cla');
const Fetch = require(CONTROLLERS + 'Fetch.cla');

router.get('/refetch', async(req, res) => {
    let response = General.initial_response('invalid_input');
    response['message'] = "Failed";

    const { id } = req.data['userData'];
    const authHeader = req.data['token'];
    response = await Fetch.neededData(id, authHeader, 'refetch');

    Security.returnResponse(res, req, response);
    return;
})

module.exports = router;