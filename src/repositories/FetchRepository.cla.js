const User = require('@model/User.schema');

class FetchRepository
{
    static async getUserById(id) {
        return await User.findOne({_id : id});
    }
}

module.exports = FetchRepository;