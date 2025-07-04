const BaseRepository = require('@repository/BaseRepository.cla');
const User = require('@model/User.schema');
const { selEncrypt, }  = require('@main_util/security.util');

class FetchRepository extends BaseRepository{

    static async getUserById(res, id) {
        try{
            // Return the user data
            return await User.findOne({_id : id});
        }catch(error){
            this.handleException(res, error);
        }
    }
}

module.exports = FetchRepository;