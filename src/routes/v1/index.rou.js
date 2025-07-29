const express = require('express');
const router = new express.Router();
const auth = require('#route/v1/auth.rou');
const fetch = require('#route/v1/fetch.rou');
const test = require('#route/v1/test.rou');
// const profile = require('#route/profile.rou');
const { tokenValidator } = require('#middleware/tokenValidator');
const { returnNotFound} = require('#core_util/handler.util');


// USING ROUTES
router.use("/test", test);// test route
router.use("/auth",auth);// auth route
router.use("/fetch", tokenValidator, fetch);// fetch route
// router.use("/profile", tokenValidator, profile);// profile 

router.use('*', (req, res) => {
    returnNotFound(res, 'Invalid request');
})

module.exports = router;