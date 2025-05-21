const BaseService = require(SERVICES + 'BaseService.cla');
const FetchRepository = require(REPOSITORIES + 'FetchRepository.cla');

const User = require(MODELS + 'User.schema');
const { log } = require(MAIN_UTILS + 'logger.util');
const { setToken } = require(MAIN_UTILS + 'token.util');
const UserResource = require(RESOURCES + 'UserResource');


class Fetch extends BaseService{
    static async authFetchData (res, id){
        try {
            //get user data
            const user = await FetchRepository.getUserById(res, id);
            const token = user ? null : setToken(id);

            if(token && user){
                const data = new UserResource(user).toJSON();
                return {token, data};
            }
        } catch (error) {
            this.handleException(res, error);
        }

        return null;
    }

    static async appFetchData (res, id, token){
        response = {};
        try{
            //get user data
            const user = await User.findOne({_id : id});
            token = token ?? setToken(id);

            if(token && user){
                const data = new UserResource(user).toJSON();
                response = {token, data}
            }
        }catch(err){
            this.handleException(res, error);
        }
    }
}

module.exports = Fetch;