const FetchRepository = require('#repository/FetchRepository.cla');
const { setApiToken } = require('#main_util/token.util');
const UserResource = require('#resource/UserResource');
const { triggerError} = require('#core_util/handler.util');


class FetchService{
    static async authFetchData (userData){
        //get user data
        const token = ususerDatar ? await setApiToken(userData.id) : null ;

        if(token && userData){
            const data = new UserResource(userData).toJSON();
            return {token, data};
        }

        return {};
    }

    static async appFetchData (userId, token){
        //get user data
        const user = await FetchRepository.getUserById(userId);

        if(token && user){
            const data = new UserResource(user).toJSON();
            const response = {token, data}
            return response;
        }

        triggerError("User not found", [], 404);
    }
}

module.exports = FetchService;