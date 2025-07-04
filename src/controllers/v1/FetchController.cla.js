const BaseController = require('@controller/BaseController.cla');
const FetchService = require('@service/v1/FetchService.cla');


class FetchController extends BaseController{

    static async authFetchData (id){
        return await FetchService.authFetchData(id);
    }

    static async appFetchData (req){
        try{
            await FetchService.appFetchData(req);
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

module.exports = FetchController;