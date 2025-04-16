const express = require('express');
const router = new express.Router();


const AuthController = require(CONTROLLERS + 'AuthController.cla');

//LOGIN
router.post('/login', (req,res) => {
    AuthController.login(req, res);
})


// //SIGNUP [1. SEND OTP]
// router.post('/su_send_otp', async(req,res) => {
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.suSendOtp(req.data.input);

//     //if there is no error
//     if(!error.status){
//         const { veri_type } = req.data.input; 
//         //set send_medium and use_case in input data
//         req.data.input['send_medium'] = (veri_type === 'email') ? veri_type : "mobile_number";
//         req.data.input['first_name'] = "user";
//         req.data.input['use_case'] = "register";
        
//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.sendOtp();
//     }else{
//         //set the error in response data
//         response['error_data'] = error.data;
//     }
    
//     Security.returnResponse(res, req, response);
//     return;
// })


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


// //REGISTER
// router.post('/register', async(req,res) => {
//     let regType = "multi";
//     let response = General.initial_response('invalid_input');

//     //validate inputs
//     const error = await Validator.register(req.data.input, regType);

//     //if there is no error
//     if(!error.status){
//         const {veri_type, receiving_medium} = req.data.input
//         if(regType === "multi")
//             //set email or mobile_number into input data
//             veri_type === 'email' ? req.data.input['email'] = receiving_medium : req.data.input['mobile_number'] = receiving_medium ;
        
//         const AuthIns = new Auth(req, res);
//         response = await AuthIns.register(regType);

//         if (response.status) {
//             //set auth [with jwt and cookies]
//             const token = await Token.setToken(response.id);
//             //Cookie.setCookies(req, res, 'token', token)
//             res.cookie("_menatreyd", token);
            
//             //unset id key
//             delete response['id']
//         }
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