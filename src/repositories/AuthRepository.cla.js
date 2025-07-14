const { findUserByEmailOrPhone, createUserAccount, resetUserPaswword } = require('@database/mongo/user.db');

class AuthRepository
{

    static async getUserByLoginId(loginId) {
        return await findUserByEmailOrPhone(loginId);
    }

    static async createUser(data) {
        return await createUserAccount(data);
    }

    static async updatePassword(data){
        return await resetUserPaswword(data);
    }
}

module.exports = AuthRepository;