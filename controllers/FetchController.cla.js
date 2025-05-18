const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { setToken } = require(MAIN_UTILS + 'token.util');


let response = {
    status:false,
    message:"Failed",
    message_detail:"Error occurred while running request",
    response_data:{},
    error_data:{}
}

class FetchController {
    static logInfo(data,type= 'Fetch'){
        log(type, data, 'info')
    }

    static logError(data, type= 'Fetch'){
        log(type, data, 'error')
    }

    static async neededData (id, token = null, type ='fetch'){
        response = {};
        try{
            //get user data
            const selUserData = "-token -user_ext_data -password -transaction_pin -unique_id -_id -__v";
            const data = await User.findOne({_id : id}, selUserData);
            token = token ?? setToken(id);

            if(token && data){
                response = {token, data}
            }
        }catch(err){
            Fetch.logError('Fetch Needed Data', err);
        }
        return response;
    }

    
}

module.exports = FetchController;