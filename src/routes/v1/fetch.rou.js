const express = require('express');
const router = new express.Router();
const FetchController = require('#controller/v1/FetchController.cla');


router.get('/refetch', async(req,res) => {
    FetchController.appFetchData(req, res);
});

module.exports = router;