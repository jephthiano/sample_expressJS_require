const BaseService = require(SERVICES + 'BaseService.cla');
const FetchRepository = require(REPOSITORIES + 'FetchRepository.cla');
const { setToken } = require('@main_util/token.util');
const { selEncrypt }  = require('@main_util/security.util');
const UserResource = require(RESOURCES + 'UserResource');


class FetchService extends BaseService{
    static async authFetchData (res, user){
        try {
            //get user data
            const token = user ? await setToken(user.id) : null ;

            if(token && user){
                const data = new UserResource(user).toJSON();
                return {token, data};
            }
        } catch (error) {
            this.handleException(res, error);
        }

        return {};
    }

    static async appFetchData (req, res){
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