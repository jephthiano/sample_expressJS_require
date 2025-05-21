const BaseRepository = require(REPOSITORIES + 'BaseRepository.cla');
const User = require(MODELS + 'User.schema');
const { selEncrypt, }  = require(MAIN_UTILS + 'security.util');

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