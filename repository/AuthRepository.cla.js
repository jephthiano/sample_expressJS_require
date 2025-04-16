const BaseRepository = require(REPOSITORIES + 'BaseRepository.cla');
const User = require(MODELS + 'User.schema');
const { selEncrypt, }  = require(MAIN_UTILS + 'security.util');

class AuthRepository extends BaseRepository{
    static async getUserByLoginId(res, loginId) {
        try{

            const encLoginId = selEncrypt(loginId.toLowerCase(), 'general');
            const where = { $or: [{ mobile_number: encLoginId }, { email: encLoginId }] };
    
            // Return the user data
            return await User.findOne(where);
        }catch(error){
            this.handleException(res, error);
        }
    }
}

module.exports = AuthRepository;