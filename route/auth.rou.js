const express = require('express');
const router = new express.Router();
const AuthController = require(CONTROLLERS + 'AuthController.cla');

//LOGIN
router.post('/login', (req,res) => {
    AuthController.login(req, res);
});

//SEND OTP
router.post('/send_otp/:type', async (req, res) => {
    const { type } = req.params;
    AuthController.sendOtp(req, res, type);
});

//VERIFY OTP
router.post('/send_otp/:type', async (req, res) => {
    const { type } = req.params;
    AuthController.verifyOtp(req, res, type);
});


//REGISTER
router.post('/register', async(req,res) => {
    AuthController.register(req, res);
});

//RESET PASSWORD
router.post('/reset_password', async(req,res) => {
    AuthController.resetPassword(req, res);
});

//LOGOUT
router.post('/logout', async(req,res) => {
    AuthController.logout(req, res);
});


module.exports = router;