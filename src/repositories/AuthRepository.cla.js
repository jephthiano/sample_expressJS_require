const User = require('@model/User.schema');
const { createUserDTO, updatePasswordDTO } = require('@dto/user.dto');
const { selEncrypt, }  = require('@main_util/security.util');

class AuthRepository
{

    static async getUserByLoginId(loginId) {
        const encLoginId = selEncrypt(loginId.toLowerCase(), 'email_phone');
        const where = { $or: [{ mobile_number: encLoginId }, { email: encLoginId }] };

        // Return the user data
        return await User.findOne(where);
    }

    static async createUser(data) {
        const userData = createUserDTO(data);
        return await User.create(userData);
    }

    static async updatePassword(data){
        data = updatePasswordDTO(data);
        
        const { password, receiving_medium } = data;
        const encMedium = selEncrypt(receiving_medium, 'email_phone');
        
        return await User.findOneAndUpdate(
            {$or: [{ mobile_number: encMedium }, { email: encMedium }]},
            { password },
            { new: true }
        )   
    }
}

module.exports = AuthRepository;