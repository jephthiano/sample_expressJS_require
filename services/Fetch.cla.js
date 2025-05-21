const UserSch = require(MODELS + 'User.schema');
const TransactionHistorySch = require(MODELS + 'TransactionHistory.schema');
const InAppNotiSch = require(MODELS + 'InAppNotification.schema');

const General = require(MAIN_UTILS + 'general.cla');


let response = {
    status:false,
    message:"Failed",
    message_detail:"Error occurred while running request",
    response_data:{},
    error_data:{}
}

class Fetch {
    static logInfo(data,type= 'Fetch'){
        General.log(type, data, 'info')
    }

    static logError(data, type= 'Fetch'){
        General.log(type, data, 'error')
    }

    static async neededData (id, header='', type ='fetch'){
        try{
            //get user data
            const selUserData = "-token -user_ext_data -password -transaction_pin -unique_id -_id -__v";
            const userData = await UserSch.findOne({_id : id}, selUserData);

            //transaction history
            let transactionHistory = await TransactionHistorySch.find({user_id : id}, "-__v -_id -user_id");

            // in-app notification
            let InAppNoti = await InAppNotiSch.find({user_id : id}, "-__v -_id -user_id");
            if(userData){
                transactionHistory = transactionHistory ?? {};
                let inAppNotification = InAppNoti ?? {};

                if(type === "fetch"){
                    response = {userData, transactionHistory, inAppNotification};
                }else{
                    const response_data = {userData, transactionHistory, inAppNotification};
                    userResource
                    response['status'] = true,
                    response['message'] = 'Success';
                    response['response_data'] = response_data;
                }
            }
        }catch(err){
            Fetch.logError('Fetch Needed Data', err);
        }
        return response;
    }

    static async transactionData (id, query){
        const cur_page = (General.isNumber(query.cur_page)) ? query.cur_page : 1 ;
        
        try{
            //get transaction data
            const selTransData = "-user_id -_id";
            let transactionHistory = await TransactionHistory.findOne({user_id : id}, "-__v -_id -user_id");

            if(transactionHistory){
                response['status'] = true,
                response['message'] = 'Success';
                response['response_data'] = transactionHistory;
            }
        }catch(err){
            Fetch.logError('Fetch Transaction Data', err);
        }

        return response;
    }
}

module.exports = Fetch;