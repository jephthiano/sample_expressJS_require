const BaseRepository = require(REPOSITORIES + 'BaseRepository.cla');
const User = require(MODELS + 'User.schema');
const { createUserDTO } = require(DTOS + 'user.dto');
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

    static async createUser(res, data) {
        try{
            const userData = createUserDTO(data);
            console.log(userData);
            return await User.create(userData);
        }catch(error){
            this.handleException(res, error);
        }
    }
}

module.exports = AuthRepository;