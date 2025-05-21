const BaseController = require(CONTROLLERS + 'BaseController.cla');
const FetchService = require(SERVICES + 'FetchService.cla');


class FetchController extends BaseController{

    static async authFetchData (res, id){
        try {
            return await FetchService.authFetchData(res, id);
        } catch (error) {
            this.handleException(res, error);
        }

    }

    static async appFetchData (res, id, token){
        try{
            await FetchService.authFetchData(res, id, token);
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

module.exports = FetchController;