const BaseService = require('@service/BaseService.cla');
const FetchRepository = require('@repository/FetchRepository.cla');
const { setApiToken } = require('@main_util/token.util');
const { selEncrypt }  = require('@main_util/security.util');
const UserResource = require('@resource/UserResource');


class FetchService extends BaseService{
    static async authFetchData (user){
        //get user data
        const token = user ? await setApiToken(user.id) : null ;

        if(token && user){
            const data = new UserResource(user).toJSON();
            return {token, data};
        }

        return {};
    }

    static async appFetchData (req){
        try{
            //get user data
            const user = await FetchRepository.getUserById(res, req.user.id);
            const token = selEncrypt(req.token, 'token');

            if(token && user){
                const data = new UserResource(user).toJSON();
                const response = {token, data}
                return this.sendResponse(res, response, "Success");
            }
        }catch(err){
            this.handleException(res, err);
        }

        return this.triggerError("User not found", [], 404);
    }
}

module.exports = FetchService;