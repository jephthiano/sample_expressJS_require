const BaseService = require(SERVICES + 'BaseService.cla');
const FetchRepository = require(REPOSITORIES + 'FetchRepository.cla');

const User = require(MODELS + 'User.schema');
const { setToken } = require(MAIN_UTILS + 'token.util');
const UserResource = require(RESOURCES + 'UserResource');


class Fetch extends BaseService{
    static async authFetchData (res, id){
        try {
            //get user data
            const user = await FetchRepository.getUserById(res, id);
            const token = user ? setToken(id) : null ;

            if(token && user){
                const data = new UserResource(user).toJSON();
                return {token, data};
            }
        } catch (error) {
            this.handleException(res, error);
        }

        return {};
    }

    static async appFetchData (res, id, token){
        try{
            //get user data
            const user = await FetchRepository.getUserById(res, id);

            if(token && user){
                const data = new UserResource(user).toJSON();
                const response = {token, data}
                return this.sendResponse(res, response, "Success");
            }
        }catch(err){
            this.handleException(res, error);
        }

        return this.triggerError("User not found", [], 404);
    }
}

module.exports = Fetch;