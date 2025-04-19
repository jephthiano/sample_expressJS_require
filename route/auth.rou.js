const express = require('express');
const router = new express.Router();


const AuthController = require(CONTROLLERS + 'AuthController.cla');

//LOGIN
router.post('/login', (req,res) => {
    AuthController.login(req, res);
});

router.post('/send_otp/:type', async (req, res) => {
    const { type } = req.params;
    AuthController.sendOtp(req, res, type);
});


//REGISTER
router.post('/register', async(req,res) => {
    AuthController.register(req, res);
});


// //SIGN UP [2. VERIFY OTP]
// router.post('/su_verify_otp', async(req,res) => {
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.verifyOtp(req.data.input);

//     //if there is no error
//     if(!error.status){
//         //set use_case in input data
//         req.data.input['use_case'] = "register";

//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.verifyOtp();
        
//     }else{
//         //set the error in response data
//         response['error_data'] = error.data;
//     }
    
//     Security.returnResponse(res, req, response);
//     return;
// })


// //FORGOT PASSWORD [1. SEND OTP]
// router.post('/fp_send_otp', async(req,res) => {
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.fpSendOtp(req.data.input); 

//     //if there is no error
//     if(!error.status){
//         const resData = error.data;
//         const { receiving_medium } = req.data.input;
        
//         //set send_medium, first_name and use case in input data
//         req.data.input['send_medium'] = (Security.validate_input(receiving_medium, 'email')) ? "email" : "mobile_number" ;
//         req.data.input['first_name'] = Security.sel_decry(resData.first_name, 'first_name');
//         req.data.input['use_case'] = "forgot_password";

//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.sendOtp();
//     }else{
//         //set the error in response data
//         response['error_data'] = error.data;
//     }
    
//     Security.returnResponse(res, req, response);
//     return;
// })


// //FORGOT PASSWORD [2. VERIFY OTP]
// router.post('/fp_verify_otp', async(req,res) => {
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.verifyOtp(req.data.input);
    
//     //if there is no error
//     if(!error.status){
//         //set use_case in input data
//         req.data.input['use_case'] = "forgot_password";
        
//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.verifyOtp();
//     }else{
//         //set the error in response data
//         response['error_data'] = error.data;
//     }
    
//     Security.returnResponse(res, req, response);
//     return;
// })


// //FORGOT PASSWORD [3. RESET PASSWORD]
// router.post('/reset_password', async(req,res) => {
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.resetPassword(req.data.input);

//     //if there is no error
//     if(!error.status){
//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.resetPassword();
//     }else{
//         //set the error in response data
//         response['error_data'] = error.data;
//     }
    
//     Security.returnResponse(res, req, response);
//     return;
// })


// //LOGOUT
// router.get('/logout', async(req,res) => {
//     let response = General.initial_response('invalid_input');
//     response['status'] = true;
//     response['message'] = "Success";
//     response['messageDetail'] = "Log out successful";

//     // unset cookie
//     //Cookie.deleteCookies(req, res, 'token', token)
//     res.clearCookie('_menatreyd');
    
//     Security.returnResponse(res, req, response);    
//     return;
// })

module.exports = router;