const BaseController = require('#controller/BaseController.cla');
const FetchService = require('#service/v1/FetchService.cla');
const { getApiToken } = require('#main_util/token.util.js');


class FetchController extends BaseController{
    static async authFetchData (userData){
        return await FetchService.authFetchData(userData);
    }

    static async appFetchData (req, res){
        try{
            const userId = req.user.id
            const token = getApiToken(req); // change to get token

            if (!userId || !token) this.triggerError("Request failed, try again", [], 400);

            const response = await FetchService.appFetchData(userId, token);

            return this.sendResponse(res, response, "Success");
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

module.exports = FetchController