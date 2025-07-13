const User = require('@model/User.schema');
const { createUserDTO, updatePasswordDTO } = require('@dto/user.dto');
const { selEncrypt, selDecrypt }  = require('@main_util/security.util');

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
        
        const user =  await User.findOneAndUpdate(
            {$or: [{ mobile_number: encMedium }, { email: encMedium }]},
            { password },
            { new: true }
        )  
        
        if(!user) return null;

        return {
            email: selDecrypt(user.email, 'email'),
            first_name: selDecrypt(user.first_name, 'first_name'),
        };
    }
}

module.exports = AuthRepository;