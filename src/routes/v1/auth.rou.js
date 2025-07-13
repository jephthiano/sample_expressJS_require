const express = require('express');
const router = new express.Router();
const AuthController = require('@controller/v1/AuthController.cla');

//LOGIN
router.post('/login', (req,res) => {
    AuthController.login(req, res);
});

//REGISTER
router.post('/register', async(req,res) => {
    AuthController.register(req, res);
});

//SEND OTP
router.post('/send_otp/:type', async (req, res) => {
    AuthController.sendOtp(req, res);
});

//VERIFY OTP
router.post('/verify_otp/:type', async (req, res) => {
    AuthController.verifyOtp(req, res);
});


//SIGN UP
router.post('/signup', async(req,res) => {
    AuthController.signup(req, res);
});

//RESET PASSWORD
router.post('/reset_password', async(req,res) => {
    AuthController.resetPassword(req, res);
});

//LOGOUT
router.post('/logout/', async(req,res) => {
    AuthController.logout(req, res);
});


module.exports = router;