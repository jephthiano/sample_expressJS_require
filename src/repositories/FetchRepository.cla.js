const { findUserByID } = require('@database/mongo/user.db');

class FetchRepository
{
    static async getUserById(userId) {
        return await findUserByID(userId);
    }
}

module.exports = FetchRepository;