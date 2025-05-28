const express = require('express');
const router = new express.Router();
const FetchController = require(CONTROLLERS + 'FetchController.cla');


router.get('/refetch', async(req,res) => {
    FetchController.appFetchData(req, res);
});

module.exports = router;