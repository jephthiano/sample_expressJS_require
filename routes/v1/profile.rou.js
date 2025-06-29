const express = require('express');
const router = new express.Router();

const General = require('@main_util/general.cla');
const Security = require('@main_util/Security.cla');

const Profile = require(CONTROLLERS + 'Profile.cla');
const Validator = require('@validator_util/profile.val');
const AuthValidator = require('@validator_util/auth.val');


//change username
router.post('/change_username', async(req, res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.changeUsername(req.data.input, req.data.userData);

    //if there is no error
    if (!error.status) {
        const ProfileIns = new Profile(req, res);
        response = await ProfileIns.changeUsername();
    } else {
        //set the error in response data
        response['error_data'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})

//change email
router.post('/change_email', async(req, res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.changeEmail(req.data.input, req.data.userData);

    //if there is no error
    if (!error.status) {
        const ProfileIns = new Profile(req, res);
        response = await ProfileIns.changeEmail();
    } else {
        //set the error in response data
        response['error_data'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//send otp
router.get('/send_otp', async (req, res) => {
    const { type } = req.query;

    let { email, first_name } = req.data.userData
    
    //set send_medium, use_case, email and first_name in input data
    req.data.input['first_name'] = Security.sel_decry(first_name, 'first_name');
    req.data.input['email'] = Security.sel_decry(email, 'email');
    if (type === 'email') {
        req.data.input['send_medium'] = 'email' ;
        req.data.input['use_case'] = "verify_email";
    } else if (type === 'mobile_number') {
        req.data.input['send_medium'] = 'mobile_number' ;
        req.data.input['use_case'] = "verify_mobile_number";
    }
    
    
    const ProfileIns = new Profile(req, res);
    let response = await ProfileIns.sendOTP(type);
    
    Security.returnResponse(res, req, response);
    return;
})


//verify otp
router.post('/verify_otp', async(req,res) => {
    let response = General.initial_response('invalid_input');

    let { type } = req.data.input
    let { email, first_name } = req.data.userData

    //validate inputs
    const error = await AuthValidator.verifyOtp(req.data.input);

    //if there is no error
    if (!error.status) {
        //set  use_case, email and first_name in input data
        req.data.input['first_name'] = Security.sel_decry(first_name, 'first_name');
        req.data.input['email'] = Security.sel_decry(email, 'email');
        if (type === 'email') {
            req.data.input['use_case'] = "verify_email";
        } else if (type === 'mobile_number') {
            req.data.input['send_medium'] = 'mobile_number';
        }

        const ProfileIns = new Profile(req, res);
        response = await ProfileIns.verifyOTP(type);
    }else{
        //set the error in response data
        response['error_data'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})



module.exports = router;