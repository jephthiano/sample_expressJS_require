const BaseRepository = require('@repository/BaseRepository.cla');
const User = require('@model/User.schema');
const { createUserDTO, updatePasswordDTO } = require('@dto/user.dto');
const { selEncrypt, }  = require('@main_util/security.util');

class AuthRepository extends BaseRepository{

    static async getUserByLoginId(res, loginId) {
        try{
            const encLoginId = selEncrypt(loginId.toLowerCase(), 'email_phone');
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
            return await User.create(userData);
        }catch(error){
            this.handleException(res, error);
        }
    }

    static async updatePassword(res, data){
        try{
            data = updatePasswordDTO(data);
            
            const { password, receiving_medium } = data;
            const encMedium = selEncrypt(receiving_medium, 'email_phone');
            
            return await User.findOneAndUpdate(
                {$or: [{ mobile_number: encMedium }, { email: encMedium }]},
                { password },
                { new: true }
            )
        }catch(error){
            this.handleException(res, error);
        }   
    }
}

module.exports = AuthRepository;