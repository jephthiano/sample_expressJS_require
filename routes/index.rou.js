const express = require('express');
const router = new express.Router();
const auth = require(ROUTES + 'auth.rou');
const fetch = require(ROUTES + 'fetch.rou');
// const profile = require(ROUTES + 'profile.rou');
// const cronJob = require(ROUTES + 'cron_job.rou');
const { tokenValidator } = require(MIDDLEWARE + 'tokenValidator');



// USING ROUTES
router.use("/auth",auth);// auth route
router.use("/fetch", tokenValidator, fetch);// fetch route
// router.use("/profile", tokenValidator, profile);// profile 
// router.use("/cronjob",cronJob);  // auth route [unauthenticated]

router.use('*', (req, res) => {
    res.status(404).send('Invalid request');
})

module.exports = router;