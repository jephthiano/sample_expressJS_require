const BaseController = require('@controller/BaseController.cla');
const FetchService = require('@service/v1/FetchService.cla');


class FetchController extends BaseController{

    static async authFetchData (res, id){
        try {
            return await FetchService.authFetchData(res, id);
        } catch (error) {
            this.handleException(res, error);
        }
    }

    static async appFetchData (req, res){
        try{
            await FetchService.appFetchData(req, res);
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

module.exports = FetchController;